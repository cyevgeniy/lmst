import type { PaginationParams, Status } from '../types/shared'
import { ApiResult, fail, getQueryParams, success } from '../utils/api'
import { logErr } from '../utils/errors'
import { fetchJson } from '../utils/fetch'

export const PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE =
  'This server requires authentication to view the public timeline. Sign in to continue.'

interface Access {
  local: 'public' | 'authenticated' | 'disabled'
  remote: 'public' | 'authenticated' | 'disabled'
}

interface Instance {
  configuration?: {
    timelines_access?: {
      live_feeds?: Access
    }
  }
}

let permsByServer = new Map<string, Promise<Access | undefined>>()

export async function getPublicTimeline(
  server: string,
  params: PaginationParams = {},
): Promise<ApiResult<Status[]>> {
  // key=value&key=value&key=value
  let prm = getQueryParams(params),
    url = `${server}/api/v1/timelines/public${prm}`

  try {
    let access = await getPublicAccess(server)

    if (access && needsAuth(access)) {
      return fail(PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE)
    }

    let res = await fetch(url)

    if (res.ok) return success(await res.json())
    if (res.status === 401 || res.status === 403 || res.status === 422) {
      return fail(PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE)
    }

    throw new Error(await res.text())
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

async function getPublicAccess(server: string): Promise<Access | undefined> {
  let cached = permsByServer.get(server)
  if (cached) return cached

  let pending = fetchJson<Instance>(`${server}/api/v2/instance`)
    .then((instance) => instance.configuration?.timelines_access?.live_feeds)
    .catch(() => undefined)

  permsByServer.set(server, pending)
  return pending
}

function needsAuth(access: Access): boolean {
  return access.local !== 'public' || access.remote !== 'public'
}

export async function getHomeTimeline(
  server: string,
  params: PaginationParams = {},
): Promise<ApiResult<Status[]>> {
  let prm = getQueryParams(params),
    url = `${server}/api/v1/timelines/home${prm}`

  return getTimeline(url, true)
}

export interface GetStatusesByTagOptions {
  server: string
  params: PaginationParams
}

export async function getTagTimeline(
  tag: string,
  opts: GetStatusesByTagOptions = { params: {}, server: '' },
) {
  let prm = getQueryParams(opts.params),
    url = `${opts.server}/api/v1/timelines/tag/${tag}${prm}`

  return getTimeline(url)
}

async function getTimeline(
  url: string,
  withCredentials?: boolean,
): Promise<ApiResult<Status[]>> {
  try {
    let resp = await fetchJson<Status[]>(url, { withCredentials })
    return success(resp)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

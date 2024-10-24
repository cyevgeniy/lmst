import type { PaginationParams, Status } from '../types/shared'
import { ApiResult, fail, getQueryParams, success } from '../utils/api'
import { $fetch } from '../utils/fetch'

interface TimelineParams extends PaginationParams  {
  local?: boolean
  remote?: boolean
  only_media?: boolean
}

export async function getPublicTimeline(
  server: string,
  params: TimelineParams = {}
): Promise<ApiResult<Status[]>> {
  // key=value&key=value&key=value
  const prm = getQueryParams(params)
  const _server = `${server}/api/v1/timelines/public${prm}`
  const resp = await fetch(_server)

  if (resp.status === 200)
   return  success<Status[]>(await resp.json())

  return fail('Can not load public timeline')
}

export async function getHomeTimeline(
  server: string,
  params: TimelineParams = {}
): Promise<ApiResult<Status[]>> {
  const prm = getQueryParams(params)
  // xxx: only_media doesn't work
  const _server = `${server}/api/v1/timelines/home${prm}`
  const resp = await $fetch(_server, {
    withCredentials: true
  })

  if (resp.ok)
    return success<Status[]>(await resp.json())

  return fail('Can not load home timeline')
}

export interface GetStatusesByTagOptions {
  server: string
  params: PaginationParams
}

export async function getTagTimeline(tag: string, opts: GetStatusesByTagOptions = {params: {}, server: '' }) {
  const prm = getQueryParams(opts.params)
  const url = `${opts.server}/api/v1/timelines/tag/${tag}${prm}`

  const resp = await fetch(url)

  if (resp.status === 200)
    return success<Status[]>(await resp.json())

  return fail('Statuses was not loaded')
}

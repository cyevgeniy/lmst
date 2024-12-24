import type { PaginationParams, Status } from '../types/shared'
import { ApiResult, fail, getQueryParams, success } from '../utils/api'
import { logErr } from '../utils/errors'
import { fetchJson } from '../utils/fetch'

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
  let prm = getQueryParams(params),
  url = `${server}/api/v1/timelines/public${prm}`
  
  return getTimeline(url)
}

export async function getHomeTimeline(
  server: string,
  params: TimelineParams = {}
): Promise<ApiResult<Status[]>> {
  let prm = getQueryParams(params),
  url = `${server}/api/v1/timelines/home${prm}`
  
  return getTimeline(url, true)
}

export interface GetStatusesByTagOptions {
  server: string
  params: PaginationParams
}

export async function getTagTimeline(tag: string, opts: GetStatusesByTagOptions = {params: {}, server: '' }) {
  let prm = getQueryParams(opts.params),
  url = `${opts.server}/api/v1/timelines/tag/${tag}${prm}`

  return getTimeline(url)
}

async function getTimeline(url: string, withCredentials?: boolean): Promise<ApiResult<Status[]>> {
  try {
    let resp = await fetchJson<Status[]>(url, {withCredentials})
    return success(resp)
  }
  catch(e: unknown) {
    return fail(logErr(e))
  }  
}

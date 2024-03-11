import type { PaginationParams, Status } from '../types/shared'
import { ApiResult, fail, success } from '../utils/api'

interface TimelineParams extends PaginationParams  {
  local?: boolean
  remote?: boolean
  only_media?: boolean
}

export async function getPublicTimeline(
  server: string,
  params: TimelineParams = {}
): Promise<ApiResult<Status[]>> {
  const headers = new Headers()
  // key=value&key=value&key=value
  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')
  const _server = `${server}/api/v1/timelines/public` + (queryParams.length > 0 ? `?${queryParams}` : '')
  const resp = await fetch(_server, {
    method: 'GET',
    headers,
  })

  if (resp.status === 200)
   return  success<Status[]>(await resp.json())

  return fail('Can not load public timeline')
}

export async function getHomeTimeline(
  server: string,
  token: string,
  params: TimelineParams = {}
): Promise<ApiResult<Status[]>> {
  const headers = new Headers({
    Authorization: `Bearer ${token}`,
  })
  // key=value&key=value&key=value
  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')
  const _server = `${server}/api/v1/timelines/home` + (queryParams.length > 0 ? `?${queryParams}` : '')
  const resp = await fetch(_server, {
    method: 'GET',
    headers,
  })

  if (resp.status === 200)
    return success<Status[]>(await resp.json())

  return fail('Can not load home timeline')
}

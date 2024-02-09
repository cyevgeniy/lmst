import type { PaginationParams } from '../types/shared'

interface TimelineParams extends PaginationParams  {
  local?: boolean
  remote?: boolean
  only_media?: boolean
}

export function getPublicTimeline(server: string, params: TimelineParams = {}) {
  const headers = new Headers()
  // key=value&key=value&key=value
  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')
  console.log(queryParams)
  const _server = `${server}/api/v1/timelines/public` + (queryParams.length > 0 ? `?${queryParams}` : '')
  const f = fetch(_server, {
    method: 'GET',
    headers,
  })

  return f.then(response => {
    if (response.status === 200)
      return response.json()

    throw new Error('Can not load public timeline')
  })
    .catch(e => { throw new Error(e)})
}

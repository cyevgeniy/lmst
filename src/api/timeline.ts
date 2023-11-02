interface TimelineParams {
  local?: boolean
  remote?: boolean
  onlyMedia?: boolean
  maxId?: string
  sinceId?: string
  minId?: string
  limit?: number
}


export function getPublicTimeline(server: string, token: string, params: TimelineParams = {}) {
  const headers = new Headers()
  headers.append('Authorization', `Bearer token ${token}`)
  // TODO: add query parameters
  const f = fetch(`${server}/api/v1/timelines/public`, {
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

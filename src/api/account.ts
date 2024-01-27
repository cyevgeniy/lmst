import appConfig from '../appConfig'
import type { Account, PaginationParams } from '../types/shared.d'

export function getAccount(id: string) : Promise<Account> {
  const url = `${appConfig.server}/api/v1/accounts/${id}`

  const f = fetch(url, { method: 'GET' })

  return f.then(resp => {
    if (resp.status === 200)
      return resp.json()

    throw new Error('Cannot load account info')
  }).catch(e => { throw new Error(e)})
}

export function getStatuses(accountId: string, params: PaginationParams = {}) {
  const _server = `${appConfig.server}/api/v1/accounts/${accountId}/statuses`

  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')

  const f = fetch(_server + (queryParams.length > 0 ? `?${queryParams}` : '') , {
    method: 'GET',
  })

  return f.then(response => {
    if (response.status === 200)
      return response.json()

    throw new Error('Can not load account statuses')
  })
    .catch(e => { throw new Error(e)})
}

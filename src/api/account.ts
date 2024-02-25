import {useAppConfig} from '../appConfig'
import type { Account, PaginationParams } from '../types/shared.d'

const appConfig = useAppConfig()

export async function getAccount(id: string) : Promise<Account> {
  const url = `${appConfig.server}/api/v1/accounts/${id}`

  const resp = await fetch(url, { method: 'GET' })

  if (resp.status === 200)
    return resp.json()

  throw new Error('Cannot load account info')
}

export async function getStatuses(accountId: string, params: PaginationParams = {}) {
  const _server = `${appConfig.server}/api/v1/accounts/${accountId}/statuses`

  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')

  const resp = await fetch(_server + (queryParams.length > 0 ? `?${queryParams}` : '') , {
    method: 'GET',
  })

  if (resp.status === 200)
    return resp.json()

  throw new Error('Can not load account statuses')
}

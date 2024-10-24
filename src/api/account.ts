import {useAppConfig} from '../appConfig'
import { success, fail } from '../utils/api'
import { $fetch, fetchJson } from '../utils/fetch'
import type { ApiResult } from '../utils/api'
import type { Account, PaginationParams, Status } from '../types/shared.d'
import type { Relationship } from '../types/shared.d'

const { server } = useAppConfig()

export async function lookupAccount(webfinger: string): Promise<Account> {
  const url = `${server()}/api/v1/accounts/lookup/?acct=${webfinger}`

  const resp = await fetch(url)

  if (resp.ok)
    return resp.json()

  throw new Error('Cannot load account info')
}


export async function getAccount(id: string) : Promise<Account> {
  const url = `${server()}/api/v1/accounts/${id}`

  const resp = await fetch(url)

  if (resp.status === 200)
    return resp.json()

  throw new Error('Cannot load account info')
}

export async function getStatuses(accountId: string, params: PaginationParams = {}) {
  const _server = `${server()}/api/v1/accounts/${accountId}/statuses`

  const queryArr = Object.entries(params).filter(([_, value]) => value).map(([key, value]) => `${key}=${value}`)
  const queryParams = queryArr.join('&')

  const resp = await $fetch(_server + (queryParams.length > 0 ? `?${queryParams}` : '') , {
    withCredentials: true,
  })

  if (resp.ok)
    return success(await resp.json() as Status[])

  return fail('Can not load account statuses')
}

export async function getRelation(id: Account['id']): Promise<ApiResult<Relationship >> {
  let res: ApiResult<Relationship>
  const url = `${server()}/api/v1/accounts/relationships?id[]=${id}`

  try {
    let r = await fetchJson<Relationship[]>(url, {
      withCredentials: true
    })

    res = success(r[0])
  }
  catch (e: unknown) {
    res = fail('can\'t get relationship')
  }

  return res
}

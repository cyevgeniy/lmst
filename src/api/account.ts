import { useAppConfig } from '../appConfig'
import { success, fail, getQueryParams } from '../utils/api'
import { fetchJson } from '../utils/fetch'
import type { ApiResult } from '../utils/api'
import type { Account, PaginationParams, Status } from '../types/shared.d'
import type { Relationship } from '../types/shared.d'
import { logErr } from '../utils/errors'

let { server } = useAppConfig()

export async function lookupAccount(webfinger: string): Promise<Account> {
  let url = `${server()}/api/v1/accounts/lookup/?acct=${webfinger}`,
    resp = await fetch(url)

  if (resp.ok) return resp.json()

  throw new Error('Cannot load account info')
}

export async function getAccount(id: string): Promise<Account> {
  let url = `${server()}/api/v1/accounts/${id}`,
    resp = await fetch(url)

  if (resp.status === 200) return resp.json()

  throw new Error('Cannot load account info')
}

export async function getStatuses(
  accountId: string,
  params: PaginationParams = {},
) {
  let prm = getQueryParams(params),
    url = `${server()}/api/v1/accounts/${accountId}/statuses${prm}`

  //
  try {
    let resp = await fetchJson<Status[]>(url, {
      withCredentials: true,
    })

    return success(resp)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

export async function getRelation(
  id: Account['id'],
): Promise<ApiResult<Relationship>> {
  let res: ApiResult<Relationship>
  let url = `${server()}/api/v1/accounts/relationships?id[]=${id}`

  try {
    let r = await fetchJson<Relationship[]>(url, {
      withCredentials: true,
    })

    res = success(r[0])
  } catch (e: unknown) {
    res = fail("can't get relationship")
  }

  return res
}

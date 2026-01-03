import type { Token } from '../api/app'
import { store } from './store'
import { Account } from '../types/shared'
import { type ApiResult, fail, success } from '../utils/api'
import { logErr } from '../utils/errors'
import { fetchJson } from '../utils/fetch'
import { searchParams } from '../utils/url'
import { app } from './app'
import { appConfig } from './config'

let TOKEN_KEY = 'token'

let token: Token | undefined

function loadTokenFromStore() {
  let ut = store.getItem(TOKEN_KEY)
  return (token = ut ? (JSON.parse(ut) as Token) : undefined)
}

/**
 * Clears token info
 */
export function clearTokenInfo() {
  token = undefined
  store.removeItem(TOKEN_KEY)
}

/**
 * Returns previously obtained user token
 * @returns Token
 */
export function getToken(): Token | undefined {
  return token || loadTokenFromStore()
}

export async function authorize() {
  const res = await app.registerApp()
  if (res.ok) {
    // TODO: verify credentials and handle errors?
    let clientId = res.value.appInfo.client_id,
      params = {
        response_type: 'code',
        redirect_uri: `${appConfig.baseUrl}/oauth`,
        client_id: clientId,
        scope: 'read write push',
      },
      sp = searchParams(params)

    window.location.replace(`${appConfig.server()}/oauth/authorize?${sp}`)
  }
}

export async function getUserToken(code: string): Promise<ApiResult<Token>> {
  if (!code) return fail('Code is empty')

  let _token = getToken()

  if (_token) return success(_token)

  let appRes = await app.registerApp()

  if (!appRes.ok) {
    return appRes
  }

  let params = {
      grant_type: 'authorization_code',
      code,
      client_id: appRes.value.appInfo.client_id,
      client_secret: appRes.value.appInfo.client_secret,
      redirect_uri: `${appConfig.baseUrl}/oauth`,
      scope: 'read write follow push',
    },
    sp = searchParams(params)

  try {
    const r = await fetch(`${appConfig.server()}/oauth/token?${sp}`, {
      method: 'POST',
    })

    token = (await r.json()) as Token
    store.setItem(TOKEN_KEY, token)

    return success(token)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

/**
 * Test to make sure that the user token works.
 * @returns ApiResult<Account>
 */
export async function verifyCredentials(): Promise<ApiResult<Account>> {
  try {
    // Do not perform fetch requests, if our token is empty
    // This part of code can be removed, it's here just for
    // this small optimization.
    // Note: The idea of moving such logic to `fetch` function is a bad idea,
    // because it will be hard to debug in the future - if we perform fetch, it should be visible in the
    // network logs. Any optimizations should be outside fetch functions
    if (!getToken()) throw new Error('Token is empty')

    let user = await fetchJson<Account>(
      `${appConfig.server()}/api/v1/accounts/verify_credentials`,
      { withCredentials: true },
    )

    return success(user)
  } catch (e: unknown) {
    return fail((e as Error).message)
  }
}

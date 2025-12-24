import { Token } from '../api/app'
import { appConfig } from '../core/config'
import { ApiResult, fail, success } from '../utils/api'
import { searchParams } from '../utils/url'
import { store } from '../store'
import { app } from '../core/app'
import { createSignal } from '../utils/signal'
import { logErr } from '../utils/errors'
import type { Account } from '../types/shared'
import { fetchJson } from '../utils/fetch'

export let user = createSignal<Account>({
  id: '',
  username: '',
  acct: '',
  url: '',
  display_name: '',
  note: '',
  avatar: '',
  fields: [],
})

let token: Token | undefined

function loadTokenFromStore() {
  let ut = store.getItem(TOKEN_KEY)
  return (token = ut ? (JSON.parse(ut) as Token) : undefined)
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

  loadTokenFromStore()

  if (token) return success(token)

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

function clearUserData() {
  user({
    id: '',
    username: '',
    avatar: '',
    acct: '',
    display_name: '',
    note: '',
    url: '',
    fields: [],
  })
}

function loadCachedUser() {
  let tmp = store.getItem(USER_KEY)

  if (tmp) user(JSON.parse(tmp) as Account)
}

export function isLoaded() {
  return !!user().id
}

export async function verifyCredentials() {
  loadCachedUser()

  if (user().id) {
    return
  }

  if (!getToken()) {
    clearUserData()
    return
  }

  try {
    let _user = await fetchJson<Account>(
      `${appConfig.server()}/api/v1/accounts/verify_credentials`,
      { withCredentials: true },
    )

    user(_user)

    store.setItem(USER_KEY, _user)
  } catch {
    clearUserData()
  }
}

export function logOut() {
  loadTokenFromStore()
  store.removeItem(USER_KEY)
  store.removeItem(TOKEN_KEY)
  app.clearStore()
  clearUserData()
  appConfig.server('')
}

let TOKEN_KEY = 'token',
  USER_KEY = 'user'

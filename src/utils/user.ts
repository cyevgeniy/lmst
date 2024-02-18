import { Token } from "../api/app"
import appConfig from "../appConfig"
import { ApiResult, fail, success } from "./api"
import { registerApp } from "./app"
import { searchParams } from "./url"
import { store } from "../store"

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

let userToken: Token | undefined

export async function authorize() {
    const res = await registerApp()
      if (res.ok) {
        // TODO: verify credentials and handle errors?
        //await verifyCredentials()
        const clientId = res.value.appInfo.client_id
        const params = {
          response_type: 'code',
          redirect_uri: `${appConfig.baseUrl}/oauth`,
          client_id: clientId,
        }
        const sp = searchParams(params)

        window.location.replace(`${appConfig.server}/oauth/authorize?${sp}`)
      }
}

export async function getUserToken(code: string): Promise<ApiResult<Token>> {
  if (!code) return fail('Code is empty')
  
  if (!userToken) {
    const ut = store.getItem(TOKEN_KEY)
    userToken = ut ? JSON.parse(ut) as Token : undefined
  }

  if (userToken)
    return success(userToken)

  const app = await registerApp()

  if (!app.ok) {
    return app
  }

  const params = {
    grant_type: 'authorization_code',
    code,
    client_id: app.value.appInfo.client_id,
    client_secret: app.value.appInfo.client_secret,
    redirect_uri: `${appConfig.baseUrl}/oauth`,
    scope: 'read write follow push',
  }

  const sp = searchParams(params)

  try {
    const r = await fetch(`${appConfig.server}/oauth/token?${sp}`, {
      method: 'POST',
    })

    userToken = await r.json() as Token
    store.setItem(TOKEN_KEY, userToken)

    return success(userToken)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Can not get user token'
    return fail(msg)
  }
}

export interface CredentialAccount {
  id: string
  username: string
  acct: string
  url: string
  display_name: string
  note: string
  avatar: string
}

const user: { value: CredentialAccount | undefined } = {value: undefined}

export async function verifyCredentials() {
  loadCachedUser()

  if (user.value)
    return user.value

  const tmp = store.getItem(TOKEN_KEY)
  if (!tmp)
    return undefined
  
  const token = (JSON.parse(tmp) as Token).access_token

  const resp = await fetch(`${appConfig.server}/api/v1/accounts/verify_credentials`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    }
  })

  if (resp.status !== 200)
    return undefined

  // console.log(await resp.json())

  const _user = await resp.json() as CredentialAccount

  store.setItem(USER_KEY, _user)

  return _user
}

export function useUser() {
  return user
}

export function loadCachedUser() {
  const tmp = store.getItem(USER_KEY)

  if (tmp)
    user.value = JSON.parse(tmp) as CredentialAccount
}


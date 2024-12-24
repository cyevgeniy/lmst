import { fail, success } from '../utils/api'
import type { ApiResult } from '../utils/api'
import { logErr } from '../utils/errors'
import { fetchJson } from '../utils/fetch'

interface RegisterAppParams {
  server: string
  redirectUris: string
  clientName: string
  website: string
  scopes: string
}

export interface Application {
  id: string
  name: string
  website: string | null
  redirect_uri: string | null
  client_id: string
  client_secret: string
  vapid_key: string
}

export async function registerApp(params: RegisterAppParams): Promise<ApiResult<Application>> {
  let payload = new FormData()
  payload.append('client_name', params.clientName)
  payload.append('redirect_uris', params.redirectUris)
  payload.append('scopes', params.scopes)

  try {
    let response = await fetchJson<Application>(`${params.server}/api/v1/apps`, {
      method: 'POST',
      body: payload,
    })

    return success(response)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

export interface GetAppTokenParams {
  server: string
  client_id: string
  client_secret: string
  redirect_uri: string
  grant_type: string
  [k: string]: string
}

export interface Token {
  access_token: string
  token_type: string
  scope: string
  created_at: number
}

export async function getAppToken(params: GetAppTokenParams): Promise<ApiResult<Token>> {
  let payload = new FormData()

  let {server, ...rest} = params

  for (const key in rest) {
    payload.append(key, rest[key])
  }

  try {
    let token = await fetchJson<Token>(`${params.server}/oauth/token`, {
      method: 'POST',
      withCredentials: true,
    })

    return success(token)
  } catch(e: unknown) {
    return fail(logErr(e))
  }
}

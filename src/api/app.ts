import { fail, success } from '../utils/api'
import type { ApiResult } from '../utils/api'
import { logErr } from '../utils/errors'

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
  const payload = new FormData()
  payload.append('client_name', params.clientName)
  payload.append('redirect_uris', params.redirectUris)
  payload.append('scopes', params.scopes)

  try {
    const response = await fetch(`${params.server}/api/v1/apps`, {
      method: 'POST',
      body: payload,
    })

      if (response.status === 200)
        return success(await response.json() as Application)

      // TODO: get error messages from a server
      throw new Error('Error during application registration')
  } catch (e: unknown) {
    let msg = logErr(e)
    return {
      ok: false,
      error: msg,
    }
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
  const payload = new FormData()

  const {server, ...rest} = params

  for (const key in rest) {
    payload.append(key, rest[key])
  }

  try {
    const resp = await fetch(`${params.server}/oauth/token`, {
      method: 'POST',
      body: payload
    })

    if (resp.status === 200)
      return success(await resp.json() as Token)

    throw new Error('[Get app token]: Response status is not 200')
  } catch(e: unknown) {
    return fail(logErr(e))
  }
}

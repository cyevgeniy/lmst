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

/**
 * Register application to obtain oauth token
 */
export async function registerApp(
  params: RegisterAppParams,
): Promise<ApiResult<Application>> {
  let payload = new FormData()
  payload.append('client_name', params.clientName)
  payload.append('redirect_uris', params.redirectUris)
  payload.append('scopes', params.scopes)

  try {
    let response = await fetchJson<Application>(
      `${params.server}/api/v1/apps`,
      {
        method: 'POST',
        body: payload,
      },
    )

    return success(response)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

export interface Token {
  access_token: string
  token_type: string
  scope: string
  created_at: number
}

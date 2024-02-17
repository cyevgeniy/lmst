import { Token } from "../api/app"
import appConfig from "../appConfig"
import { ApiResult, fail, success } from "./api"
import { registerApp } from "./app"
import { searchParams } from "./url"

const TOKEN_KEY = 'lmst_userToken'

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
    const ut = localStorage.getItem(TOKEN_KEY)
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
    redirect_uri: `${appConfig}/oauth`,
    scope: 'read write follow push',
  }

  const sp = searchParams(params)

  try {
    const r = await fetch(`${appConfig.server}/oauth/token?${sp}`, {
      method: 'POST',
    })

    userToken = await r.json() as Token
    localStorage.setItem(TOKEN_KEY, JSON.stringify(userToken))

    return success(userToken)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Can not get user token'
    return fail(msg)
  }
}
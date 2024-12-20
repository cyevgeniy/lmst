import { Token } from "../api/app"
import { useAppConfig} from "../appConfig"
import { ApiResult, fail, success } from "./api"
import { searchParams } from "./url"
import { store } from "../store"
import { App } from "../app"
import { createSignal } from "./signal"
import { logErr } from "./errors"
import type { Account } from '../types/shared'

function createUserStore() {

  let config = useAppConfig(),
  app = new App(),

  user = createSignal<Account>({
    id: '',
    username: '',
    acct: '',
    url: '',
    display_name: '',
    note: '',
    avatar: '',
  }),

  token: Token | undefined

  async function authorize() {
    const res = await app.registerApp()
    if (res.ok) {
      // TODO: verify credentials and handle errors?
      //await verifyCredentials()
      const clientId = res.value.appInfo.client_id
      const params = {
        response_type: 'code',
        redirect_uri: `${config.baseUrl}/oauth`,
        client_id: clientId,
        scope: 'read write push'
      }
      const sp = searchParams(params)

      window.location.replace(`${config.server()}/oauth/authorize?${sp}`)
    }
  }

  function loadTokenFromStore() {
    if (!token) {
      const ut = store.getItem(TOKEN_KEY)
      token = ut ? JSON.parse(ut) as Token : undefined
    }
  }

  function accessToken(): string {
    return token?.access_token ?? ''
  }

  async function getUserToken(code: string): Promise<ApiResult<Token>> {
    if (!code) return fail('Code is empty')

    loadTokenFromStore()

    if (token)
      return success(token)

    const appRes = await app.registerApp()

    if (!appRes.ok) {
      return appRes
    }

    const params = {
      grant_type: 'authorization_code',
      code,
      client_id: appRes.value.appInfo.client_id,
      client_secret: appRes.value.appInfo.client_secret,
      redirect_uri: `${config.baseUrl}/oauth`,
      scope: 'read write follow push',
    }

    const sp = searchParams(params)

    try {
      const r = await fetch(`${config.server()}/oauth/token?${sp}`, {
        method: 'POST',
      })

      token = await r.json() as Token
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
    })
  }

  function loadCachedUser() {
    const tmp = store.getItem(USER_KEY)

    if (tmp)
      user(JSON.parse(tmp) as Account)
  }

  function isLoaded() {
    return Boolean(user().id)
  }

  async function verifyCredentials() {
    loadCachedUser()

    if (user().id) {
      //this.processCallbacks()
      return
    }

    let tmp = store.getItem(TOKEN_KEY)

    if (!tmp) {
      clearUserData()
      return
      //this.processCallbacks()
    }

    let token = (JSON.parse(tmp) as Token).access_token,

    resp = await fetch(`${config.server()}/api/v1/accounts/verify_credentials`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (resp.status === 200) {

      let _user = await resp.json() as Account

      user(_user)

      store.setItem(USER_KEY, _user)
    }

    //this.processCallbacks()
  }

  function logOut() {
    loadTokenFromStore()
    store.removeItem(USER_KEY)
    store.removeItem(TOKEN_KEY)
    clearUserData()
    config.server('')

    //this.processCallbacks()
  }

  return {
    user,
    authorize,
    loadTokenFromStore,
    accessToken,
    getUserToken,
    isLoaded,
    verifyCredentials,
    logOut,
  }
}

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export const user = createUserStore()

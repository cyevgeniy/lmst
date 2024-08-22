import { Token } from "../api/app"
import {useAppConfig} from "../appConfig"
import { ApiResult, fail, success } from "./api"
import { searchParams } from "./url"
import { store } from "../store"
import { App } from "../app"

export interface CredentialAccount {
  id: string
  username: string
  acct: string
  url: string
  display_name: string
  note: string
  avatar: string
}

type UserChangeCallback = (user: User) => void

const TOKEN_KEY = 'token'
const USER_KEY = 'user'

export class User implements CredentialAccount{
  private static instance: User
  private token: Token | undefined
  private onUserChangeCallbacks: UserChangeCallback[] = []
  private appConfig: ReturnType<typeof useAppConfig>
  private app: App

  public id: string = ''
  public username: string = ''
  public acct: string = ''
  public url: string = ''
  public display_name: string = ''
  public note: string = ''
  public avatar: string = ''

  constructor() {
    this.appConfig = useAppConfig()
    this.app = new App()

    if (User.instance)
      return User.instance

    User.instance = this
  }

  public addOnUserChangeCb(fn: UserChangeCallback ) {
    this.onUserChangeCallbacks.push(fn)
  }

  private processCallbacks() {
    this.onUserChangeCallbacks.forEach(fn => fn(this))
  }

  async authorize() {
    const res = await this.app.registerApp()
    if (res.ok) {
      // TODO: verify credentials and handle errors?
      //await verifyCredentials()
      const clientId = res.value.appInfo.client_id
      const params = {
        response_type: 'code',
        redirect_uri: `${this.appConfig.baseUrl}/oauth`,
        client_id: clientId,
        scope: 'read write push'
      }
      const sp = searchParams(params)

      window.location.replace(`${this.appConfig.server}/oauth/authorize?${sp}`)
    }
  }

  public loadTokenFromStore() {
    if (!this.token) {
      const ut = store.getItem(TOKEN_KEY)
      this.token = ut ? JSON.parse(ut) as Token : undefined
    }
  }

  public accessToken(): string {
    return this.token?.access_token ?? ''
  }

  public async getUserToken(code: string): Promise<ApiResult<Token>> {
    if (!code) return fail('Code is empty')

    this.loadTokenFromStore()

    if (this.token)
      return success(this.token)

    const app = await this.app.registerApp()

    if (!app.ok) {
      return app
    }

    const params = {
      grant_type: 'authorization_code',
      code,
      client_id: app.value.appInfo.client_id,
      client_secret: app.value.appInfo.client_secret,
      redirect_uri: `${this.appConfig.baseUrl}/oauth`,
      scope: 'read write follow push',
    }

    const sp = searchParams(params)

    try {
      const r = await fetch(`${this.appConfig.server}/oauth/token?${sp}`, {
        method: 'POST',
      })

      this.token = await r.json() as Token
      store.setItem(TOKEN_KEY, this.token)

      return success(this.token)
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Can not get user token'
      return fail(msg)
    }
  }

  private clearUserData() {
    this.id = ''
    this.avatar = ''
    this.display_name = ''
    this.note = ''
    this.url = ''
  }

  public isLoaded() {
    return Boolean(this.id)
  }

  async verifyCredentials() {
    this.loadCachedUser()

    if (this.id) {
      this.processCallbacks()
      return this
    }

    const tmp = store.getItem(TOKEN_KEY)
    if (!tmp) {
      this.clearUserData()
      this.processCallbacks()
      return this
    }

    const token = (JSON.parse(tmp) as Token).access_token

    const resp = await fetch(`${this.appConfig.server}/api/v1/accounts/verify_credentials`, {
      headers: {
        Authorization: `Bearer ${token}`,
      }
    })

    if (resp.status === 200) {

      const _user = await resp.json() as CredentialAccount

      this.loadUserFromObject(_user)

      store.setItem(USER_KEY, _user)
    }

    this.processCallbacks()

    return this
  }

  private loadUserFromObject(obj: CredentialAccount) {
    this.id = obj.id
    this.display_name = obj.display_name
    this.note = obj.note
    this.url = obj.url
    this.username = obj.username
    this.avatar = obj.avatar
    this.acct = obj.acct
  }

  private loadCachedUser() {
    const tmp = store.getItem(USER_KEY)

    if (tmp)
      this.loadUserFromObject(JSON.parse(tmp) as CredentialAccount)
  }

  public logOut() {
    this.loadTokenFromStore()
    store.removeItem(USER_KEY)
    store.removeItem(TOKEN_KEY)
    this.clearUserData()
    this.appConfig.server = ''

    this.processCallbacks()
  }
}

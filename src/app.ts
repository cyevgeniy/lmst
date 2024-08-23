import { registerApp as _registerApp } from "./api/app"
import { AppConfig, useAppConfig } from './appConfig'
import type { Application } from './api/app'
import type { ApiResult } from './utils/api'
import { store } from './store'
import { success } from "./utils/api"

interface RegisteredApp {
  appInfo: Application
}

const APP_INFO_KEY = 'appInfo'

export class App {
  private static instance: App
  private appInfo: Application | undefined
  // @ts-ignore config is always assigned, check out constructor
  private config: AppConfig

  constructor() {
    if (App.instance)
      return

    App.instance = this
    this.appInfo = undefined
    this.config = useAppConfig()
  }

  public async registerApp(): Promise<ApiResult<RegisteredApp>> {
    const tmp = store.getItem(APP_INFO_KEY)

    if (tmp)
      this.appInfo = JSON.parse(tmp) as Application

    if (this.appInfo)
      return success({ appInfo: this.appInfo })

    const res =  await _registerApp({
      server: this.config.server(),
      redirectUris: `${this.config.baseUrl}/oauth`,
      clientName: this.config.clientName,
      website: `${this.config.baseUrl}`,
      scopes: 'read write push follow',
    })

    if (!res.ok)
      return res

    this.appInfo = res.value
    store.setItem(APP_INFO_KEY, this.appInfo)

    return success({ appInfo: this.appInfo })
  }
}

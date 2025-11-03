import { registerApp as _registerApp } from './api/app'
import { AppConfig, useAppConfig } from './appConfig'
import type { Application } from './api/app'
import type { ApiResult } from './utils/api'
import { store } from './store'
import { success } from './utils/api'

interface RegisteredApp {
  appInfo: Application
}

let KEY = 'appInfo'

function createApp() {
  let appInfo: Application | undefined,
    config: AppConfig = useAppConfig()

  async function registerApp(): Promise<ApiResult<RegisteredApp>> {
    let tmp = store.getItem(KEY)

    if (tmp) appInfo = JSON.parse(tmp) as Application

    if (appInfo) return success({ appInfo })

    let res = await _registerApp({
      server: config.server(),
      redirectUris: `${config.baseUrl}/oauth`,
      clientName: config.clientName,
      website: `${config.baseUrl}`,
      scopes: 'read write push follow',
    })

    if (!res.ok) return res

    appInfo = res.value
    store.setItem(KEY, appInfo)

    return success({ appInfo })
  }

  function clearStore() {
    store.removeItem(KEY)
  }

  return {
    registerApp,
    clearStore,
  }
}

export let app = createApp()

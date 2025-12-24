import { registerApp as registerAppAPI } from '../api/app'
import { appConfig } from './config'
import type { Application } from '../api/app'
import type { ApiResult } from '../utils/api'
import { store } from '../store'
import { success } from '../utils/api'

interface RegisteredApp {
  appInfo: Application
}

let KEY = 'appInfo'

function createApp() {
  let appInfo: Application | undefined

  async function registerApp(): Promise<ApiResult<RegisteredApp>> {
    let tmp = store.getItem(KEY)

    if (tmp) appInfo = JSON.parse(tmp) as Application

    if (appInfo) return success({ appInfo })

    let res = await registerAppAPI({
      server: appConfig.server(),
      redirectUris: `${appConfig.baseUrl}/oauth`,
      clientName: appConfig.clientName,
      website: `${appConfig.baseUrl}`,
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

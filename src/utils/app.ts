import { registerApp as _registerApp } from "../api/app"
import config from '../appConfig'
import { success } from "./api"
import type { Application } from '../api/app'
import type { ApiResult } from "./api"
import appConfig from "../appConfig"
import { store } from "../store"

const APP_INFO_KEY = 'appInfo'

let appInfo: Application

interface RegisteredApp {
  appInfo: Application
}


export async function registerApp(): Promise<ApiResult<RegisteredApp>> {
  const tmp = store.getItem(APP_INFO_KEY)

  if (tmp)
    appInfo = JSON.parse(tmp) as Application
  
  if (appInfo)
  	return success({appInfo})

  const res =  await _registerApp({
	  server: config.server,
	  redirectUris: `${appConfig.baseUrl}/oauth`,
	  clientName: config.clientName,
    website: `${appConfig.baseUrl}`,
    scopes: 'read write push follow',
	})

  if (!res.ok)
    return res

  appInfo = res.value
  store.setItem(APP_INFO_KEY, appInfo)

  return success({appInfo})
}

import { registerApp as _registerApp } from "../api/app"
import {useAppConfig} from '../appConfig'
import { success } from "./api"
import type { Application } from '../api/app'
import type { ApiResult } from "./api"
import { store } from "../store"

const APP_INFO_KEY = 'appInfo'

let appInfo: Application

interface RegisteredApp {
  appInfo: Application
}

const appConfig = useAppConfig()


export async function registerApp(): Promise<ApiResult<RegisteredApp>> {
  const tmp = store.getItem(APP_INFO_KEY)

  if (tmp)
    appInfo = JSON.parse(tmp) as Application
  
  if (appInfo)
  	return success({appInfo})

  const res =  await _registerApp({
	  server: appConfig.server,
	  redirectUris: `${appConfig.baseUrl}/oauth`,
	  clientName: appConfig.clientName,
    website: `${appConfig.baseUrl}`,
    scopes: 'read write push follow',
	})

  if (!res.ok)
    return res

  appInfo = res.value
  store.setItem(APP_INFO_KEY, appInfo)

  return success({appInfo})
}

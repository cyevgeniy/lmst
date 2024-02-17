import { registerApp as _registerApp } from "../api/app"
import config from '../appConfig'
import { success } from "./api"
import type { Application } from '../api/app'
import type { ApiResult } from "./api"
import appConfig from "../appConfig"

const APP_INFO_KEY = 'lmst_appInfo'

let appInfo: Application

interface RegisteredApp {
  appInfo: Application
}


export async function registerApp(): Promise<ApiResult<RegisteredApp>> {
  const tmp = localStorage.getItem(APP_INFO_KEY)

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
  localStorage.setItem(APP_INFO_KEY, JSON.stringify(appInfo))

  return success({appInfo})
}

export async function verifyCredentials(token: string): Promise<boolean> {
  if (!appInfo || !token)
    return false

  const resp = await fetch(`${config.server}/api/v1/apps/verify_credentials`, {
    headers: {
      Authorization: `Bearer ${token}`, 
    }
  })

  return resp.status === 200
}

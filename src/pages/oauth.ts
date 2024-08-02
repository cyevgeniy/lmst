import { AppManager } from '../appManager'

export async function createOAuthPage(root: HTMLElement, appManager: AppManager) {
  root.innerHTML = ''
  const user = appManager.user
  
  // get authorization code from url search string
  // @ts-ignore
  const searchParams = new URL(window.location).searchParams
  const code = searchParams.get('code')

  const res = await user.getUserToken(code ?? '')

  if (!res.ok)
    console.error(res.error)
  else
    user.verifyCredentials()

  window.location.replace('/')
}
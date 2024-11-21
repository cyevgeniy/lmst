import { logErr } from '../utils/errors'
import { user } from '../utils/user'

export async function createOAuthPage(root: HTMLElement) {
  root.innerHTML = ''
  
  // get authorization code from url search string
  // @ts-ignore
  let searchParams = new URL(window.location).searchParams,
  code = searchParams.get('code'),

  res = await user.getUserToken(code ?? '')

  if (!res.ok)
    logErr(res.error)
  else
    user.verifyCredentials()

  window.location.replace('/')
}
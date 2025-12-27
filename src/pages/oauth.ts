import { logErr } from '../utils/errors'
import { refreshUserInfo } from '../core/user'
import { getUserToken } from '../core/auth'

export async function createOAuthPage(root: HTMLElement) {
  root.innerHTML = ''

  // get authorization code from url search string
  // @ts-ignore
  let searchParams = new URL(window.location).searchParams,
    code = searchParams.get('code'),
    res = await getUserToken(code ?? '')

  if (!res.ok) logErr(res.error)
  else await refreshUserInfo()

  window.location.replace('/')
}

import { logErr } from '../utils/errors'
import { verifyCredentials, getUserToken } from '../core/user'

export async function createOAuthPage(root: HTMLElement) {
  root.innerHTML = ''

  // get authorization code from url search string
  // @ts-ignore
  let searchParams = new URL(window.location).searchParams,
    code = searchParams.get('code'),
    res = await getUserToken(code ?? '')

  if (!res.ok) logErr(res.error)
  else await verifyCredentials()

  window.location.replace('/')
}

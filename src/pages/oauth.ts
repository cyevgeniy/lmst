import { div } from "../utils/dom";
import { definePage } from "../utils/page";
import { User } from '../utils/user'

export const oauthPage = definePage(() => {
  async function onParamsChange() {
    // get authorization code from url search string
    // @ts-ignore
    const searchParams = new URL(window.location).searchParams
    const code = searchParams.get('code')

    const user = new User()
    const res = await user.getUserToken(code ?? '')

    if (!res.ok) {
      console.error(res.error)
      window.location.replace('/')
    }
    else {
      user.verifyCredentials()
      window.location.replace('/')
    }
  }

  function mount(): HTMLElement {
    return div('', []) // 
  }

  return {
    mount,
    onParamsChange,
  }
})

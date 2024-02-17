import { registerApp } from "../utils/app";
import { div } from "../utils/dom";
import { definePage } from "../utils/page";
import { getUserToken } from "../utils/user";

export const oauthPage = definePage(() => {
  async function onParamsChange() {
    // get authorization code from url search string
    const searchParams = new URL(window.location).searchParams
    const code = searchParams.get('code')

    const res = await getUserToken(code ?? '')


    if (!res.ok) {
      console.log(res.error)
      window.location.replace('/')
    }
    else {
      console.log(res.value)
      const resp = await fetch('https://mstdn.social/api/v2/suggestions', {
        headers: {
          Authorization: `Bearer ${res.value.access_token}`,
        }
      })
      //window.location.replace('/')
    }

    // const app = await registerApp()

    // if (!app.ok) {
    //   window.location.replace('/')
    //   return
    // }

    // const r = await fetch(`https://mstdn.social/oauth/token?grant_type=authorization_code&code=${code}&client_id=${app.value.appInfo.client_id}&client_secret=${app.value.appInfo.client_secret}&redirect_uri=http://localhost:5173/oauth`, {
    //   method: 'POST',
    // })

    // console.log(await r.json())
  }

  function mount(): HTMLElement {
    return div('', []) // 
  }

  return {
    mount,
    onParamsChange,
  }
})
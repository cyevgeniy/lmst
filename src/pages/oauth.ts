import { div } from "../utils/dom";
import { Page } from "../utils/page";
import type { IPage } from "../utils/page";
import { User } from '../utils/user'

export class OAuthPage extends Page implements IPage {
  private readonly user: User

  constructor(opts: {
    user: User
  }) {
    super()
    this.user = opts.user
  }

  public async mount() {
    super.mount()
    this.layout.middle.innerHTML = ''
    // get authorization code from url search string
    // @ts-ignore
    const searchParams = new URL(window.location).searchParams
    const code = searchParams.get('code')

    const res = await this.user.getUserToken(code ?? '')

    if (!res.ok) {
      console.error(res.error)
      window.location.replace('/')
    }
    else {
      this.user.verifyCredentials()
      window.location.replace('/')
    }  
  }
}
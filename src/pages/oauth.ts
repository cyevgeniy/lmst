import { Page } from "../utils/page";
import type { IPage } from "../utils/page";
import { User } from '../utils/user'
import { AppManager } from '../appManager'

export class OAuthPage extends Page implements IPage {
  private readonly user: User

  constructor(appManager: AppManager) {
    super(appManager.globalMediator)
    this.user = appManager.user
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

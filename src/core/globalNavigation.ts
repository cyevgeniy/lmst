import { logOut, isLoaded as isUserLoaded } from '../core/user'
import { authorize } from '../core/auth.ts'
import { appConfig } from '../core/config'
import { lRouter } from '../router'
import { pageHistory } from '../utils/pageHistory.ts'
import { homeTimeline } from '../core/homeTimeline.ts'

export let globalNavigation = {
  goHome() {
    lRouter.navigateTo('/')
  },

  logout() {
    logOut()
    // After logout, we clear all pages cache, so the user will navigate
    // pages like in the first time
    // Without this, the main page will be empty, because
    // it exists in the cache, but the statuses list is empty (due to `timelineManager.clearStatuses` call)
    pageHistory.clear()
    homeTimeline.clearStatuses()
    this.goHome()
  },
  async login() {
    if (isUserLoaded()) this.goHome()
    else {
      let server = prompt('Enter server:')
      if (!server) return

      if (!server.startsWith('http')) server = `https://${server}`

      appConfig.server(server)
      await authorize()
    }
  },
}

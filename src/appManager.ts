import type { AppConfig } from './core/config'
import { logOut, isLoaded as isUserLoaded } from './core/user'
import { authorize } from './core/auth.ts'
import type { Router } from './router'
import type { GlobalNavigation } from './types/shared'
import { appConfig } from './core/config'
import { lRouter } from './router'
import { PageHistoryManager, usePageHistory } from './utils/pageHistory.ts'
import { homeTimeline } from './core/homeTimeline.ts'

export function useGlobalNavigation(
  tm: ReturnType<typeof homeTimeline>,
  router: Router,
  config: AppConfig,
  hm: PageHistoryManager,
): GlobalNavigation {
  function goHome() {
    router.navigateTo('/')
  }

  function logout() {
    logOut()
    // After logout, we clear all pages cache, so the user will navigate
    // pages like in the first time
    // Without this, the main page will be empty, because
    // it exists in the cache, but the statuses list is empty (due to `timelineManager.clearStatuses` call)
    hm.clear()
    tm.clearStatuses()
    goHome()
  }

  async function login() {
    if (isUserLoaded()) goHome()
    else {
      let server = prompt('Enter server:')
      if (!server) return

      if (!server.startsWith('http')) server = `https://${server}`

      config.server(server)
      await authorize()
    }
  }

  return {
    goHome,
    logout,
    login,
  }
}

export class AppManager {
  private config: AppConfig
  public timelineManager: ReturnType<typeof homeTimeline>
  public globalMediator: GlobalNavigation
  public pageHistoryManager: PageHistoryManager

  constructor() {
    this.config = appConfig
    this.timelineManager = homeTimeline()
    this.pageHistoryManager = usePageHistory()

    this.globalMediator = useGlobalNavigation(
      this.timelineManager,
      lRouter,
      this.config,
      this.pageHistoryManager,
    )
  }
}

import { getPublicTimeline, getHomeTimeline } from './api/timeline'
import { type Status } from './types/shared'
import type { AppConfig } from './core/config'
import { logOut, isLoaded as isUserLoaded } from './core/user'
import { authorize } from './core/auth.ts'
import type { Router } from './router'
import type { GlobalNavigation, ITimelineManager } from './types/shared'
import { appConfig } from './core/config'
import { lRouter } from './router'
import { PageHistoryManager, usePageHistory } from './utils/pageHistory.ts'
import { last } from './utils/arrays.ts'

export class TimelineManager implements ITimelineManager {
  private maxId: string
  public onClearCallback?: () => void
  public statuses: Status[]
  public noMoreData: boolean

  constructor() {
    this.maxId = ''
    this.statuses = []
    this.onClearCallback = undefined
    this.noMoreData = false
  }

  public onClearStatuses(fn: () => void) {
    this.onClearCallback = fn
  }

  public async loadStatuses(): Promise<Status[]> {
    console.log('load statuses!')
    let { server } = appConfig,
      fn = isUserLoaded() ? getHomeTimeline : getPublicTimeline

    let st = await fn.call(null, server(), { max_id: this.maxId })

    if (st.ok) {
      let statuses = st.value

      if (statuses.length) {
        this.statuses.push(...statuses)
        this.maxId = last(statuses)!.id
        return statuses
      } else {
        // no more records
        this.noMoreData = true
      }
    }

    return []
  }

  public resetPagination() {
    this.maxId = ''
  }

  public clearStatuses() {
    this.resetPagination()
    this.statuses = []
    this.onClearCallback && this.onClearCallback()
    this.noMoreData = false
  }
}

export function useGlobalNavigation(
  tm: TimelineManager,
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
  public timelineManager: TimelineManager
  public globalMediator: GlobalNavigation
  public pageHistoryManager: PageHistoryManager

  constructor() {
    this.config = appConfig
    this.timelineManager = new TimelineManager()
    this.pageHistoryManager = usePageHistory()

    this.globalMediator = useGlobalNavigation(
      this.timelineManager,
      lRouter,
      this.config,
      this.pageHistoryManager,
    )
  }
}

import { getPublicTimeline, getHomeTimeline } from './api/timeline'
import { type Search, type Status } from './types/shared'
import type { AppConfig } from './core/config'
import { logOut, isLoaded as isUserLoaded } from './core/user'
import { authorize } from './core/auth.ts'
import type { Router } from './router'
import type { GlobalNavigation, ITimelineManager } from './types/shared'
import { appConfig } from './core/config'
import { lRouter } from './router'
import { fetchJson } from './utils/fetch.ts'
import { PageHistoryManager, usePageHistory } from './utils/pageHistory.ts'
import { searchParams } from './utils/url.ts'
import { last } from './utils/arrays.ts'
import { createSignal } from './utils/signal.ts'

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

type SearchParams = {
  q: string
  limit?: string
  type?: string
}

function createSearchManager() {
  let res: Search,
    offset = 0,
    _noMoreData = false,
    loading = createSignal(false)

  let { server } = appConfig

  function resetOffset() {
    offset = 0
    _noMoreData = false
  }

  async function search(opts: SearchParams) {
    let q = searchParams({
      ...opts,
      offset: offset.toString(),
    })

    try {
      loading(true)
      res = await fetchJson(`${server()}/api/v2/search?${q}`, {
        withCredentials: true,
      })

      let len = res.statuses.length
      _noMoreData = len === 0
      offset += len
    } catch {
      res = {
        accounts: [],
        statuses: [],
        hashtags: [],
      }
    } finally {
      loading(false)
    }
  }

  return {
    search,
    get searchResult() {
      return res
    },
    get noMoreData() {
      return _noMoreData
    },
    resetOffset,
    loading,
  }
}

export class AppManager {
  private config: AppConfig
  public timelineManager: TimelineManager
  public globalMediator: GlobalNavigation
  public pageHistoryManager: PageHistoryManager
  public searchManager: ReturnType<typeof createSearchManager>

  constructor() {
    this.config = appConfig
    this.timelineManager = new TimelineManager()
    this.pageHistoryManager = usePageHistory()
    this.searchManager = createSearchManager()

    this.globalMediator = useGlobalNavigation(
      this.timelineManager,
      lRouter,
      this.config,
      this.pageHistoryManager,
    )
  }
}

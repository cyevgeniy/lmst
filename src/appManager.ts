import { getPublicTimeline, getHomeTimeline, getTagTimeline } from './api/timeline'
import type { Context, Search, Status } from './types/shared.d.ts'
import type { AppConfig } from './appConfig'
import { user } from './utils/user'
import { getAccount, getStatuses, lookupAccount } from './api/account'
import type { Router } from './router'
import type { Mediator } from './types/shared'
import { useAppConfig } from './appConfig'
import { lRouter } from './router'
import type { ActionPermissions } from './components/LStatusButtons'
import { ApiResult, fail, success } from './utils/api.ts'
import { genWebFinger } from './utils/shared.ts'
import { $fetch, fetchJson } from './utils/fetch.ts'
import { PageHistoryManager, usePageHistory } from './utils/pageHistory.ts'
import { searchParams } from './utils/url.ts'
import { last } from './utils/arrays.ts'
import { createSignal } from './utils/signal.ts'
import { logErr } from './utils/errors.ts'

export interface ITimelineManager {
  /**
   * List of statuses for current timeline
   */
  statuses: Status[]

  /**
   * Loads next portion of statuses
   */
  loadStatuses: () => void

  /**
   * Clears all statuses
   */
  clearStatuses: () => void

  /**
   * True if there're no more records in the timeline
   */
  noMoreData: boolean
}

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
    let { server } = useAppConfig()
    await user.verifyCredentials()
    let fn = async () => await getPublicTimeline(server(), {max_id: this.maxId})

    if (user.isLoaded())
      fn = async () => await getHomeTimeline(server(), {max_id: this.maxId})

    const st = await fn()

    if (st.ok) {
      const statuses = st.value

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

export class ProfileTimelineManager implements ITimelineManager {
  private maxId: string
  public statuses: Status[]
  private profileId: string
  public profileWebfinger: string
  public noMoreData: boolean

  constructor() {
    this.maxId = ''
    this.profileId = ''
    this.profileWebfinger = ''
    this.statuses = []
    this.noMoreData = false
  }

  public async loadStatuses(): Promise<Status[]> {
    const res = await getStatuses(this.profileId, { max_id: this.maxId })

    if (res.ok) {
      if (res.value.length) {
        this.maxId = last(res.value)!.id
        return res.value
      }
      else
        this.noMoreData = true
    }

    return []
  }

  public resetPagination() {
    this.maxId = ''
  }

  public clearStatuses() {
    this.resetPagination()
    this.statuses = []
    this.noMoreData = false
  }

  public async getAccount() {
    // Check whether profileId is a string
    if (!this.profileId && this.profileWebfinger) {
      const acc = await lookupAccount(this.profileWebfinger)
      this.profileId = acc.id

      return acc
    }

    return await getAccount(this.profileId)
  }
}

export class TagsTimelineManager implements ITimelineManager {
  private maxId: string
  public statuses: Status[]
  /**
   * Stores last loaded statuses list
   */
  private _lastChunk: Status[]
  private appConfig: AppConfig
  private keepStatuses: boolean
  public tag: string
  public noMoreData: boolean

  constructor(opts: {
    keepStatuses: boolean
  }) {
    this.maxId = ''
    this.keepStatuses = opts.keepStatuses
    this.tag = ''
    this._lastChunk = []
    this.statuses = []
    this.noMoreData = false
    this.appConfig = useAppConfig()
  }

  get lastChunk() {
    return this._lastChunk
  }

  public async loadStatuses() {
    const resp = await getTagTimeline(this.tag, {server: this.appConfig.server(), params: {max_id: this.maxId}})

    if (resp.ok) {
      const statuses = resp.value
      this._lastChunk = statuses
      this.keepStatuses && this.statuses.push(...statuses)

      if (statuses.length)
        this.maxId = last(statuses)!.id
      else
        this.noMoreData = true
    } else {
      this._lastChunk = []
    }
  }

  public clearStatuses() {
    this.statuses = []
    this._lastChunk = []
    this.noMoreData = false
  }

}

export interface IStatusManager {
  postStatus(params: {statusText: string}): Promise<ApiResult<Status>>
  boostStatus(id: Status['id']): Promise<void>
  unboostStatus(id: Status['id']): Promise<void>
  deleteStatus(id: Status['id']): Promise<void>
  getPermissions: () => ActionPermissions
  ownStatus(s: Status): boolean
}

export class StatusManager implements IStatusManager {
  private server: AppConfig['server']

  constructor() {
    this.server = useAppConfig().server
  }

  public getLinkToStatus(status: Status): string {
    const webfinger = genWebFinger(status.account.url)
    const server = this.server().slice(8)
    return `/status/${server}/${webfinger}/${status.id}`
  }

  public navigateToStatus(status: Status): void {
    lRouter.navigateTo(this.getLinkToStatus(status))
  }

  public async postStatus(params: {statusText: string, in_reply_to_id?: string}): Promise<ApiResult<Status>> {
    user.loadTokenFromStore()

    const payload = new FormData()
    payload.append('status', params.statusText)
    params.in_reply_to_id && payload.append('in_reply_to_id', params.in_reply_to_id)

    let result: ApiResult<Status>

    try {
      const resp = await $fetch(`${this.server()}/api/v1/statuses`, {
        method: 'POST',
        withCredentials: true,
        body: payload,
      })

      if (!resp.ok)
        result = fail('Status was not posted')

      result = success(await resp.json())

    } catch(e: unknown) {
      result = fail(logErr(e))
    }

    return result
  }

  public async boostStatus(id: Status['id']): Promise<void> {
    if (!user.isLoaded())
      return

    try {
        await fetchJson(`${this.server()}/api/v1/statuses/${id}/reblog`, {
          method: 'POST',
          withCredentials: true,
      })
    }
    catch(e: unknown) {
      logErr(e)
    }
  }

  public async unboostStatus(id: Status['id']): Promise<void> {
    if (!user.isLoaded())
      return

    try {
        await fetchJson(`${this.server()}/api/v1/statuses/${id}/unreblog`, {
          method: 'POST',
          withCredentials: true,
      })
    }
    catch(e: unknown) {
      logErr(e)
    }
  }

  public async deleteStatus(id: Status['id']) {
    await user.verifyCredentials()
    user.loadTokenFromStore()

    try {
      await fetchJson(`${this.server()}/api/v1/statuses/${id}`, {
        method: 'DELETE',
        withCredentials: true,
       })
    }
    catch (e: unknown) {
      logErr(e)
    }
  }

  public async getStatus(id: Status['id'], opts?: {server?: string}): Promise<ApiResult<Status>> {
    
    let result: ApiResult<Status>
    
    try {
      const resp = await $fetch(`${opts?.server ?? this.server()}/api/v1/statuses/${id}`)

      if (!resp.ok)
        throw new Error('Status was not fetched')

      result = success(await resp.json())
    }
    catch(e: unknown) {
      result = fail(logErr(e))
    }

    return result
  }

  public async getStatusContext(id: Status['id'], opts?: {server: string}): Promise<ApiResult<Context>> {

    let result: ApiResult<Context>

    try {
      const resp = await fetch(`${opts?.server ?? this.server()}/api/v1/statuses/${id}/context`)

      if (resp.status !== 200)
        throw new Error('Context was not fetched')

      result = success(await resp.json())
    }
    catch(e: unknown) {
      result = fail(logErr(e))
    }

    return result
  }



  public getPermissions(): ActionPermissions {
    return {
      canDelete: user.isLoaded(),
      canBoost: user.isLoaded(),
    }
  }

  public ownStatus(s: Status) {
    return user.user().acct === s.account.acct
  }
}

/**
 * This mediator object handles global application events,
 * such as login, logout and navigate to the main page
 */
export class GlobalPageMediator implements Mediator {
  private timelineManager: TimelineManager
  private router: Router
  private config: AppConfig
  private pageHistoryManager: PageHistoryManager

  constructor(opts: {
    timelineManager: TimelineManager
    router: Router
    config: AppConfig
    pageHistoryManager: PageHistoryManager
  }) {
    this.timelineManager = opts.timelineManager
    this.router = opts.router
    this.config = opts.config
    this.pageHistoryManager = opts.pageHistoryManager
  }

  private goHome() {
    this.router.navigateTo('/')
  }

  async notify(msg: string) {
    if (msg === 'navigate:main') {
      this.goHome()
      return
    }

    if (msg === 'navigate:logout') {
      user.logOut()
      // After logout, we clear all pages cache, so the user will navigate
      // pages like in the first time
      // Without this, the main page will be empty, because
      // it exists in the cache, but the statuses list is empty (due to `timelineManager.clearStatuses` call)
      this.pageHistoryManager.clear()
      this.timelineManager.clearStatuses()
      this.goHome()
      return
    }

    if (msg === 'navigate:login') {
      await user.verifyCredentials()
      if (user.isLoaded())
        this.goHome()
      else {
        const server = prompt('Enter server:')
        if (!server)
          return

        this.config.server(server)
        await user.authorize()
      }
    }
  }
}

type SearchParams = {
  q: string
  limit?: string
  type?: string
}

function createSearchManager() {
  let res: Search
  let offset = 0
  let _noMoreData = false
  let loading = createSignal(false)

  const { server } = useAppConfig()

  function resetOffset() {
    offset = 0
    _noMoreData = false
  }

  async function search(opts: SearchParams) {
    const q = searchParams({
      ...opts,
      offset: offset.toString(),
    })

    try {
      loading(true)
      res = await fetchJson(`${server()}/api/v2/search?${q}`, {
        method: 'GET',
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
    }
    finally {
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
  public statusManager: StatusManager
  public timelineManager: TimelineManager
  public globalMediator: GlobalPageMediator
  public tagsManager: TagsTimelineManager
  public pageHistoryManager: PageHistoryManager
  public searchManager: ReturnType<typeof createSearchManager>

  constructor() {
    this.config = useAppConfig()
    this.statusManager = new StatusManager()
    this.timelineManager = new TimelineManager()
    this.tagsManager = new TagsTimelineManager({keepStatuses: false})
    this.pageHistoryManager = usePageHistory()
    this.searchManager = createSearchManager()

    this.globalMediator = new GlobalPageMediator({
      config: this.config,
      timelineManager: this.timelineManager,
      router: lRouter,
      pageHistoryManager: this.pageHistoryManager,
    })
  }
}

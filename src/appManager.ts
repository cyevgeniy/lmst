import { getPublicTimeline, getHomeTimeline, getTagTimeline } from './api/timeline'
import type { Context, Status } from './types/shared.d.ts'
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
import { PageHistoryManager, usePageHistory } from './utils/pageHistory.ts'

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
    user.loadTokenFromStore()
    let fn = async () => await getPublicTimeline(server(), {max_id: this.maxId})

    if (user.isLoaded())
      fn = async () => await getHomeTimeline(server(), user.accessToken(),  {max_id: this.maxId})

    const st = await fn()

    if (st.ok) {
      const statuses = st.value

      if (statuses.length) {

        this.statuses.push(...statuses)
        this.maxId = statuses[statuses.length - 1].id
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
    user.loadTokenFromStore()
    const res = await getStatuses(this.profileId, { max_id: this.maxId }, user.accessToken())

    if (res.ok) {
      if (res.value.length) {
        this.maxId = res.value[res.value.length - 1].id
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
        this.maxId = statuses[statuses.length - 1]?.id ?? ''
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
      const resp = await fetch(`${this.server()}/api/v1/statuses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken()}`,
        },
        body: payload,
      })

      if (resp.status !== 200)
        result = fail('Status was not posted')

      result = success(await resp.json())

    } catch(e: unknown) {
      let msg = 'Post status error'
      if (e instanceof Error) {
        console.error(e.message)
        msg = e.message
      }
      
      result = fail(msg)
    }

    return result
  }

  public async boostStatus(id: Status['id']): Promise<void> {
    if (!user.isLoaded())
      return

    try {
        const resp = await fetch(`${this.server()}/api/v1/statuses/${id}/reblog`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.accessToken()}`,
          },
      })

      if (resp.status !== 200)
        throw new Error('Status was not boosted')
    }
    catch(e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  public async unboostStatus(id: Status['id']): Promise<void> {
    if (!user.isLoaded())
      return

    try {
        const resp = await fetch(`${this.server()}/api/v1/statuses/${id}/unreblog`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${user.accessToken()}`,
          },
      })

      if (resp.status !== 200)
        throw new Error('Status was not unboosted')
    }
    catch(e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  public async deleteStatus(id: Status['id']) {
    await user.verifyCredentials()
    user.loadTokenFromStore()

    try {
       const resp = await fetch(`${this.server()}/api/v1/statuses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.accessToken()}`,
        },
       })

      if (resp.status !== 200)
        throw new Error('Error on post deletion')
    }
    catch (e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  public async getStatus(id: Status['id'], opts?: {server?: string}): Promise<ApiResult<Status>> {
    
    let result: ApiResult<Status>
    
    try {
      const resp = await fetch(`${opts?.server ?? this.server()}/api/v1/statuses/${id}`, {
        method: 'GET'
      })

      if (resp.status !== 200)
        throw new Error('Status was not fetched')

      result = success(await resp.json())
    }
    catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)

        result = fail(e.message)
      }

      result = fail('')
    }

    return result
  }

  public async getStatusContext(id: Status['id'], opts?: {server: string}): Promise<ApiResult<Context>> {
    
    let result: ApiResult<Context>
    
    try {
      const resp = await fetch(`${opts?.server ?? this.server()}/api/v1/statuses/${id}/context`, {
        method: 'GET'
      })

      if (resp.status !== 200)
        throw new Error('Context was not fetched')

      result = success(await resp.json())
    }
    catch(e: unknown) {
      if (e instanceof Error) {
        console.error(e.message)

        result = fail(e.message)
      }

      result = fail('')
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

export class AppManager {
  private config: AppConfig
  public statusManager: StatusManager
  public timelineManager: TimelineManager
  public globalMediator: GlobalPageMediator
  public tagsManager: TagsTimelineManager
  public pageHistoryManager: PageHistoryManager

  constructor() {
    this.config = useAppConfig()
    this.statusManager = new StatusManager()
    this.timelineManager = new TimelineManager()
    this.tagsManager = new TagsTimelineManager({keepStatuses: false})
    this.pageHistoryManager = usePageHistory()

    this.globalMediator = new GlobalPageMediator({
      config: this.config,
      timelineManager: this.timelineManager,
      router: lRouter,
      pageHistoryManager: this.pageHistoryManager,
    })
  }
}

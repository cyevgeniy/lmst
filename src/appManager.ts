import {
  getPublicTimeline,
  getHomeTimeline,
  getTagTimeline,
} from './api/timeline'
import {
  type MediaAttachment,
  type Context,
  type Search,
  type Status,
} from './types/shared'
import type { AppConfig } from './core/config'
import { logOut, isLoaded as isUserLoaded, user } from './core/user'
import { authorize } from './core/auth.ts'
import { getAccount, getStatuses, lookupAccount } from './api/account'
import type { Router } from './router'
import type { GlobalNavigation } from './types/shared'
import { appConfig } from './core/config'
import { lRouter } from './router'
import type { ActionPermissions } from './components/LStatusButtons'
import { ApiResult, fail, success } from './utils/api.ts'
import { fetchJson } from './utils/fetch.ts'
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
      } else this.noMoreData = true
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

  constructor(opts: { keepStatuses: boolean }) {
    this.maxId = ''
    this.keepStatuses = opts.keepStatuses
    this.tag = ''
    this._lastChunk = []
    this.statuses = []
    this.noMoreData = false
    this.appConfig = appConfig
  }

  get lastChunk() {
    return this._lastChunk
  }

  public async loadStatuses() {
    const resp = await getTagTimeline(this.tag, {
      server: this.appConfig.server(),
      params: { max_id: this.maxId },
    })

    if (resp.ok) {
      const statuses = resp.value
      this._lastChunk = statuses
      this.keepStatuses && this.statuses.push(...statuses)

      if (statuses.length) this.maxId = last(statuses)!.id
      else this.noMoreData = true
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
  postStatus(params: {
    statusText: string
    files?: File[]
  }): Promise<ApiResult<Status>>
  boostStatus(id: Status['id']): Promise<void>
  unboostStatus(id: Status['id']): Promise<void>
  deleteStatus(id: Status['id']): Promise<void>
  getPermissions: () => ActionPermissions
  ownStatus(s: Status): boolean
}

export class StatusManager implements IStatusManager {
  private server: AppConfig['server']

  constructor() {
    this.server = appConfig.server
  }

  public getLinkToStatus(status: Status): string {
    let server = this.server().slice(8)
    return `/status/${server}/${status.account.acct}/${status.id}`
  }

  public navigateToStatus(status: Status): void {
    lRouter.navigateTo(this.getLinkToStatus(status))
  }

  private async uploadFile(file: File): Promise<MediaAttachment | undefined> {
    let body = new FormData()
    body.append('file', file)

    try {
      return await fetchJson<MediaAttachment>(`${this.server()}/api/v2/media`, {
        method: 'post',
        withCredentials: true,
        body,
      })
    } catch {
      // we want to return undefined in such cases
    }
  }

  // Uploads specified files and returns their ids
  private async uploadFiles(files: File[]): Promise<string[]> {
    let proms: Promise<MediaAttachment | undefined>[] = []

    for (const f of files) proms.push(this.uploadFile(f))

    // @ts-expect-error don't add type guard to the filter for size limit reasons
    return (await Promise.allSettled(proms))
      .map((r) => (r.status === 'fulfilled' ? r.value?.id : undefined))
      .filter(Boolean)
  }

  public async postStatus(params: {
    statusText: string
    in_reply_to_id?: string
    files?: File[]
    sensitive?: boolean
  }): Promise<ApiResult<Status>> {
    let mediaIds = params.files ? await this.uploadFiles(params.files) : []

    let payload = new FormData()
    payload.append('status', params.statusText)
    for (const id of mediaIds) payload.append('media_ids[]', id)

    params.in_reply_to_id &&
      payload.append('in_reply_to_id', params.in_reply_to_id)
    // TODO: need to create a function that generates FormData for specified payload
    params.sensitive && payload.append('sensitive', params.sensitive.toString())

    try {
      let resp = await fetchJson<Status>(`${this.server()}/api/v1/statuses`, {
        method: 'post',
        withCredentials: true,
        body: payload,
      })

      return success(resp)
    } catch (e: unknown) {
      return fail(logErr(e))
    }
  }

  public async boostStatus(id: Status['id']): Promise<void> {
    if (!isUserLoaded()) return

    try {
      await fetchJson(`${this.server()}/api/v1/statuses/${id}/reblog`, {
        method: 'post',
        withCredentials: true,
      })
    } catch (e: unknown) {
      if (import.meta.env.DEV) logErr(e)
    }
  }

  public async unboostStatus(id: Status['id']): Promise<void> {
    if (!isUserLoaded()) return

    try {
      await fetchJson(`${this.server()}/api/v1/statuses/${id}/unreblog`, {
        method: 'post',
        withCredentials: true,
      })
    } catch (e: unknown) {
      if (import.meta.env.DEV) logErr(e)
    }
  }

  public async deleteStatus(id: Status['id']) {
    try {
      await fetchJson(`${this.server()}/api/v1/statuses/${id}`, {
        method: 'DELETE',
        withCredentials: true,
      })
    } catch (e: unknown) {
      if (import.meta.env.DEV) logErr(e)
    }
  }

  public async getStatus(
    id: Status['id'],
    opts?: { server?: string },
  ): Promise<ApiResult<Status>> {
    try {
      const resp = await fetchJson<Status>(
        `${opts?.server ?? this.server()}/api/v1/statuses/${id}`,
      )

      return success(resp)
    } catch (e: unknown) {
      return fail(logErr(e))
    }
  }

  public async getStatusContext(
    id: Status['id'],
    opts?: { server: string },
  ): Promise<ApiResult<Context>> {
    let result: ApiResult<Context>

    try {
      let resp = await fetch(
        `${opts?.server ?? this.server()}/api/v1/statuses/${id}/context`,
      )

      if (resp.status !== 200) throw new Error('Context was not fetched')

      result = success(await resp.json())
    } catch (e: unknown) {
      result = fail(logErr(e))
    }

    return result
  }

  public getPermissions(): ActionPermissions {
    let loaded = isUserLoaded()
    return {
      canDelete: loaded,
      canBoost: loaded,
    }
  }

  public ownStatus(s: Status) {
    return user().acct === s.account.acct
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
  public statusManager: StatusManager
  public timelineManager: TimelineManager
  public globalMediator: GlobalNavigation
  public tagsManager: TagsTimelineManager
  public pageHistoryManager: PageHistoryManager
  public searchManager: ReturnType<typeof createSearchManager>

  constructor() {
    this.config = appConfig
    this.statusManager = new StatusManager()
    this.timelineManager = new TimelineManager()
    this.tagsManager = new TagsTimelineManager({ keepStatuses: false })
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

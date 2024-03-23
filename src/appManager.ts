import { getPublicTimeline, getHomeTimeline } from './api/timeline'
import type { Status } from './types/shared.d.ts'
import type { AppConfig } from './appConfig'
import { User } from './utils/user'
import { getAccount, getStatuses } from './api/account'
import type { Router } from './router'
import type { Mediator } from './types/shared'

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

  //onClearStatuses: (fn: () => void) => void
}

export class TimelineManager implements ITimelineManager {
  private maxId: string
  private user: User
  private config: AppConfig
  public onClearCallback?: () => void
  public statuses: Status[]


  constructor(opts: {
    user: User,
    config: AppConfig
  }) {
    this.maxId = ''
    this.statuses = []
    this.user = opts.user
    this.config = opts.config
    this.onClearCallback = undefined
  }

  public onClearStatuses(fn: () => void) {
    this.onClearCallback = fn
  }

  public async loadStatuses(): Promise<Status[]> {
    await this.user.verifyCredentials()
    this.user.loadTokenFromStore()
    let fn = async () => await getPublicTimeline(this.config.server, {max_id: this.maxId})

    if (this.user.isLoaded())
      fn = async () => await getHomeTimeline(this.config.server, this.user.accessToken(),  {max_id: this.maxId})

    const st = await fn()

    if (st.ok) {
      const statuses = st.value
      this.statuses.push(...statuses)
      this.maxId = statuses[statuses.length - 1].id
      return statuses
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
  }
}

export class ProfileTimelineManager implements ITimelineManager {
  private maxId: string
  public statuses: Status[]
  public profileId: string
  private user: User

  constructor(opts: {
    user: User
  }) {
    this.maxId = ''
    this.profileId = ''
    this.statuses = []
    this.user = opts.user
  }

  public async loadStatuses(): Promise<Status[]> {
    this.user.loadTokenFromStore()
    const statuses = await getStatuses(this.profileId, { max_id: this.maxId }, this.user.accessToken())
    this.maxId = statuses[statuses.length - 1].id

    return statuses
  }

  public resetPagination() {
    this.maxId = ''
  }

  public clearStatuses() {
    this.resetPagination()
    this.statuses = []
  }

  public async getAccount() {
    return await getAccount(this.profileId)
  }
}

export interface IStatusManager {
  postStatus(params: {statusText: string}): Promise<void>
  boostStatus(id: Status['id']): Promise<void>
  actionsEnabled(): boolean
  ownStatus(s: Status): boolean
}

export class StatusManager implements IStatusManager {
  private user: User
  private config: AppConfig

  constructor(opts: {user: User, config: AppConfig}) {
    this.user = opts.user
    this.config = opts.config
  }

  public async postStatus(params: {statusText: string}) {
    this.user.loadTokenFromStore()

    const payload = new FormData()
    payload.append('status', params.statusText)

    try {
      const resp = await fetch(`${this.config.server}/api/v1/statuses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.user.accessToken()}`,
        },
        body: payload,
      })

      if (resp.status !== 200)
        throw new Error('Status was not posted')

    } catch(e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  public async boostStatus(id: Status['id']): Promise<void> {
    if (!this.user.isLoaded)
      return

    try {
        const resp = await fetch(`${this.config.server}/api/v1/statuses/${id}/reblog`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.user.accessToken()}`,
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

  public actionsEnabled() {
    return this.user.isLoaded()
  }

  public ownStatus(s: Status) {
    console.log(this.user)
    return this.user.acct === s.account.acct
  }
}

/**
 * This mediator object handles global application events,
 * such as login, logout and navigate to the main page
 */
export class GlobalPageMediator implements Mediator {
  private user: User
  private timelineManager: TimelineManager
  private router: Router
  private config: AppConfig

  constructor(opts: {
    user: User
    timelineManager: TimelineManager
    router: Router
    config: AppConfig
  }) {
    this.user = opts.user
    this.timelineManager = opts.timelineManager
    this.router = opts.router
    this.config = opts.config
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
      this.user.logOut()
      this.timelineManager.clearStatuses()
      this.goHome()
      return
    }

    if (msg === 'navigate:login') {
      await this.user.verifyCredentials()
      if (this.user.isLoaded())
        this.goHome()
      else {
        const server = prompt('Enter server:') ?? ''
        this.config.server = server
        await this.user.authorize()
      }
    }
  }
}

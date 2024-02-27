import { getPublicTimeline, getHomeTimeline } from './api/timeline'
import type { Status } from './types/shared.d.ts'
import type { AppConfig } from './appConfig'
import { User } from './utils/user'

export interface ITimelineManager {
  /**
   * List of statuses for current timeline
   */
  statuses: Status[]

  /**
   * Loads next portion of statuses
   */
  loadStatuses: () => void
}

export class TimelineManager implements ITimelineManager {
  private maxId: string
  private user: User
  private config: AppConfig
  public statuses: Status[]

  constructor(opts: {
    user: User,
    config: AppConfig
  }) {
    this.maxId = ''
    this.statuses = []
    this.user = opts.user
    this.config = opts.config
  }

  public async loadStatuses(): Promise<Status[]> {
    console.log(this.maxId)
    await this.user.verifyCredentials()
    this.user.loadTokenFromStore()
    let fn = async () => await getPublicTimeline(this.config.server, {max_id: this.maxId}) as Status[]

    if (this.user.isLoaded())
      fn = async () => await getHomeTimeline(this.config.server, this.user.accessToken(),  {max_id: this.maxId})
    
    // xxx: handle fetch errors?
    const statuses = await fn()
    this.statuses.push(...statuses)
    this.maxId = statuses[statuses.length - 1].id
    return statuses
  }

  public resetPagination() {
    this.maxId = ''
  }
}

export interface IStatusManager {
  postStatus(params: {statusText: string}): Promise<void>
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
}

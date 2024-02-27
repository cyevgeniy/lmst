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

  public async loadStatuses() {
    await this.user.verifyCredentials()
    this.user.loadTokenFromStore()
    let fn = async () => await getPublicTimeline(this.config.server, {max_id: this.maxId}) as Status[]

    if (this.user.isLoaded())
      fn = async () => await getHomeTimeline(this.config.server, this.user.accessToken(),  {max_id: this.maxId})
    
    // xxx: handle fetch errors?
    const statuses = await fn()
    this.statuses.push(...statuses)
  }
}


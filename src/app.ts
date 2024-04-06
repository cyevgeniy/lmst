import { GlobalPageMediator, StatusManager, TimelineManager } from './appManager'
import { lRouter } from './router'
import { User } from "./utils/user"
import { useAppConfig } from './appConfig'
export class App {
  public user: User
  public statusManager: StatusManager
  public timelineManager: TimelineManager
  public globalMediator: GlobalPageMediator

  constructor() {
    this.user = new User()
    const config = useAppConfig()
    this.statusManager = new StatusManager({user: this.user, config})
    this.timelineManager = new TimelineManager({user: this.user, config})
    this.globalMediator = new GlobalPageMediator({
      user: this.user,
      config,
      timelineManager: this.timelineManager,
      router: lRouter,
    })
  }
}

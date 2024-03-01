import '../assets/css/main.css'
import { lRouter } from './router'
import { TimelinePage } from './pages/timeline'
import { ProfilePage } from './pages/profile'
import { OAuthPage } from './pages/oauth'
import { ComposePage } from './pages/compose'
import { useAppConfig } from "./appConfig"
import { User } from "./utils/user"
import { GlobalPageMediator, StatusManager, ProfileTimelineManager, TimelineManager } from './appManager'

document.getElementById('btn')?.addEventListener('click', () => {
  lRouter.navigateTo('/profile/13/question/question-123/')
})

document.getElementById('btn1')?.addEventListener('click', () => {
  lRouter.navigateTo('/settings')
})

const appConfig = useAppConfig()
const user = new User()
const statusManager = new StatusManager({user, config: appConfig})
const timelineManager = new TimelineManager({user, config: appConfig})
const globalPageMediator = new GlobalPageMediator({
  user,
  config: appConfig,
  timelineManager,
  router: lRouter,
})


const composePage = new ComposePage(statusManager, globalPageMediator)
const timelinePage = new TimelinePage(timelineManager, globalPageMediator)
const oauthPage = new OAuthPage({ user, pm: globalPageMediator })

lRouter.on('/', () => timelinePage.mount())
// For profiles, always create new instances of profilePages, so that they won't
// share the same timeline cache
// BTW, maybe we want to "reset" timeline manager state in mount() function instead
// of creation of new instances each time
lRouter.on('/profile/:id', (params) => (new ProfilePage(new ProfileTimelineManager(), globalPageMediator)).mount(params))
lRouter.on('/oauth', () => oauthPage.mount())
lRouter.on('/compose', () => composePage.mount())

import '../assets/css/main.css'
import { lRouter } from './router'
import { TimelinePage } from './pages/timeline'
import { ProfilePage } from './pages/profile'
import { OAuthPage } from './pages/oauth'
import { ComposePage } from './pages/compose'
import { ProfileTimelineManager, AppManager } from './appManager'

const appManager = new AppManager()
const composePage = new ComposePage(appManager)
const timelinePage = new TimelinePage(appManager)

const oauthPage = new OAuthPage(appManager)

lRouter.on('/', () => timelinePage.mount())

// For profiles, always create new instances of profilePages, so that they won't
// share the same timeline cache
// BTW, maybe we want to "reset" timeline manager state in mount() function instead
// of creation of new instances each time
function createProfilePage() {
  const p = new ProfilePage({
    pm: new ProfileTimelineManager({user: appManager.user}),
    pageMediator: appManager.globalMediator,
    sm: appManager.statusManager
  })

  return p
}

lRouter.on('/profile/:webfinger', (params) => (createProfilePage()).mount(params))
lRouter.on('/oauth', () => oauthPage.mount())
lRouter.on('/compose', () => composePage.mount())

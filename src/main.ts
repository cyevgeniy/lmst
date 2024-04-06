import '../assets/css/main.css'
import { lRouter } from './router'
import { TimelinePage } from './pages/timeline'
import { ProfilePage } from './pages/profile'
import { OAuthPage } from './pages/oauth'
import { ComposePage } from './pages/compose'
import { App } from './app'
import { ProfileTimelineManager } from './appManager'

const app = new App()
const composePage = new ComposePage(app)
const timelinePage = new TimelinePage(app)

const oauthPage = new OAuthPage(app)

lRouter.on('/', () => timelinePage.mount())

// For profiles, always create new instances of profilePages, so that they won't
// share the same timeline cache
// BTW, maybe we want to "reset" timeline manager state in mount() function instead
// of creation of new instances each time
function createProfilePage() {
  const p = new ProfilePage({
    pm: new ProfileTimelineManager({user: app.user}),
    pageMediator: app.globalMediator,
    sm: app.statusManager
  })

  return p
}

lRouter.on('/profile/:id', (params) => (createProfilePage()).mount(params))
lRouter.on('/oauth', () => oauthPage.mount())
lRouter.on('/compose', () => composePage.mount())

import '../assets/css/main.css'
import { lRouter } from './router'
import { createTimelinePage } from './pages/timeline'
import { createProfilePage } from './pages/profile'
import { createTagsPage } from './pages/tags'
import { createOAuthPage } from './pages/oauth'
import { createComposePage } from './pages/compose'
import { ProfileTimelineManager, AppManager } from './appManager'
import { createStatusPage } from './pages/status'
import { createMainPage } from './utils/page'

const appManager = new AppManager()
const mainPage = createMainPage(appManager.globalMediator)
// const somePage = composePage(mainPage.middle, appManager)
// lRouter.on('/', (params) => createComposePage(mainPage.middle, appManager))

// const composePage = new ComposePage(appManager)
// const timelinePage = new TimelinePage(appManager)
// const tagsPage = new TagsPage(appManager)

// const oauthPage = new OAuthPage(appManager)

lRouter.on('/', () => createTimelinePage(mainPage.middle, appManager))

// For profiles, always create new instances of profilePages, so that they won't
// share the same timeline cache
// BTW, maybe we want to "reset" timeline manager state in mount() function instead
// of creation of new instances each time
function _createProfilePage(params?: Record<string, string>) {
  const p = createProfilePage(mainPage.middle, {
    pm: new ProfileTimelineManager({user: appManager.user}),
    pageMediator: appManager.globalMediator,
    sm: appManager.statusManager,
    params,
  })

  return p
}

lRouter.on('/profile/:webfinger', (params) => (_createProfilePage(params)))
lRouter.on('/oauth', () => createOAuthPage(mainPage.root, appManager))
lRouter.on('/compose', () => createComposePage(mainPage.middle, appManager))
lRouter.on('/tags/:tag', (params) => createTagsPage(mainPage.middle, appManager, params))
lRouter.on('/status/:server/:webfinger/:id', (params) => createStatusPage(mainPage.middle, appManager, params))

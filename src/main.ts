import '../assets/css/main.css'
import { lRouter, RouteParams } from './router'
import { createTimelinePage } from './pages/timeline'
import { createNotificationsPage } from './pages/notifications'
import { createProfilePage } from './pages/profile'
import { createTagsPage } from './pages/tags'
import { createOAuthPage } from './pages/oauth'
import { createComposePage } from './pages/compose'
import { ProfileTimelineManager, AppManager } from './appManager'
import { createStatusPage } from './pages/status'
import { createMainPage, Page } from './utils/page'
import { getCached } from './utils/pageHistory'
import { createSearchPage } from './pages/search'
import { user } from './utils/user'

const appManager = new AppManager()

function cacheAndNavigate(
  path: string,
  mountpoint: HTMLElement,
  cb: () => Page,
): void {
  let page = getCached(path, cb)

  mountpoint.innerHTML = ''
  mountpoint.appendChild(page.el)
}

user.verifyCredentials().then(() => {
  function _createProfilePage(params: RouteParams) {
    let cb = () =>
      createProfilePage(mainPage.middle, {
        pm: new ProfileTimelineManager(),
        sm: appManager.statusManager,
        params,
      })
    cacheAndNavigate(params._path, mainPage.middle, cb)
  }

  let mainPage = createMainPage(appManager.globalMediator)

  lRouter.on('/', (params) => {
    cacheAndNavigate(params._path, mainPage.middle, () =>
      createTimelinePage(mainPage.middle, appManager),
    )
  })
  lRouter.on('/profile/:webfinger', (params) => _createProfilePage(params))
  lRouter.on('/notifications', () => createNotificationsPage(mainPage.middle))
  lRouter.on('/oauth', () => createOAuthPage(mainPage.root))
  lRouter.on('/compose', () => createComposePage(mainPage.middle, appManager))
  lRouter.on('/search', (params) => {
    cacheAndNavigate(params._path, mainPage.middle, () =>
      createSearchPage(mainPage.middle, appManager),
    )
  })
  lRouter.on('/tags/:tag', (params) => {
    cacheAndNavigate(params._path, mainPage.middle, () =>
      createTagsPage(mainPage.middle, appManager, params),
    )
  })
  lRouter.on('/status/:server/:webfinger/:id', (params) =>
    createStatusPage(mainPage.middle, appManager, params),
  )
})

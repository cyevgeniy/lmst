import '../assets/css/main.css'
import { lRouter, RouteParams } from './router'
import { createTimelinePage } from './pages/timeline'
import { createNotificationsPage } from './pages/notifications'
import { createProfilePage } from './pages/profile'
import { createTagsPage } from './pages/tags'
import { createOAuthPage } from './pages/oauth'
import { createComposePage } from './pages/compose'
import { createStatusPage } from './pages/status'
import { createMainPage, Page } from './utils/page'
import { getCached } from './utils/pageHistory'
import { createSearchPage } from './pages/search'
import { refreshUserInfo } from './core/user'
import { childs } from './utils/dom'

lRouter.onBeforeEach(refreshUserInfo)

function cacheAndNavigate(
  path: string,
  mountpoint: HTMLElement,
  cb: () => Page,
): void {
  let page = getCached(path, cb)

  mountpoint.innerHTML = ''
  childs(mountpoint, [page])
}

function _createProfilePage(params: RouteParams) {
  let cb = () =>
    createProfilePage(mainPage.middle, {
      params,
    })
  cacheAndNavigate(params._path, mainPage.middle, cb)
}

let mainPage = createMainPage()

lRouter.on('/', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () =>
    createTimelinePage(mainPage.middle),
  )
})
lRouter.on('/profile/:webfinger', (params) => _createProfilePage(params))
lRouter.on('/notifications', () => createNotificationsPage(mainPage.middle))
lRouter.on('/oauth', () => createOAuthPage(mainPage.root))
lRouter.on('/compose', () => createComposePage(mainPage.middle))
lRouter.on('/search', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () =>
    createSearchPage(mainPage.middle),
  )
})
lRouter.on('/tags/:tag', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () =>
    createTagsPage(mainPage.middle, params),
  )
})
lRouter.on('/status/:server/:webfinger/:id', (params) =>
  createStatusPage(mainPage.middle, params),
)

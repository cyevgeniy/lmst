import '../assets/css/main.css'
import { lRouter, RouteParams } from './router'
import { createTimelinePage } from './pages/timeline'
import { createProfilePage } from './pages/profile'
import { createTagsPage } from './pages/tags'
import { createOAuthPage } from './pages/oauth'
import { createComposePage } from './pages/compose'
import { ProfileTimelineManager, AppManager } from './appManager'
import { createStatusPage } from './pages/status'
import { createMainPage, Page } from './utils/page'
import type { ElLike } from './utils/dom'
import { getCached } from './utils/pageHistory'
import { createSearchPage } from './pages/search'

const appManager = new AppManager()
const mainPage = createMainPage(appManager.globalMediator)

function cacheAndNavigate(path: string, mountpoint: HTMLElement, cb: () => Page): void {
  
  let page = getCached(path, cb)

  mountpoint.innerHTML = ''
  mountpoint.appendChild(page.el)
}

lRouter.on('/', (params) =>{
  cacheAndNavigate(params._path, mainPage.middle, () => createTimelinePage(mainPage.middle, appManager))
})

function _createProfilePage(params: RouteParams) {
  const cb = () => createProfilePage(mainPage.middle, {
    pm: new ProfileTimelineManager(),
    sm: appManager.statusManager,
    params,
  })
  cacheAndNavigate(params._path, mainPage.middle, cb)
}

const noop = () => {}

function createPageProxy(pageConstructor: () => any) {
  let toCleanup: () => void = noop

  function createPage() {
    toCleanup?.()

    // Kind of tricky thing - we call onUnmount not when the page is
    // unloaded, but before loading it for the next time
    let page = pageConstructor()
    toCleanup = page?.onUnmount ?? noop

    return { el: page.el } as ElLike
  }

  const res = {
    createPage,
  }

  return res
}

const composePageProxy = createPageProxy(() => createComposePage(mainPage.middle, appManager))

lRouter.on('/profile/:webfinger', (params) => (_createProfilePage(params)))
lRouter.on('/oauth', () => createOAuthPage(mainPage.root))
lRouter.on('/compose', composePageProxy.createPage)
lRouter.on('/search', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () => createSearchPage(mainPage.middle, appManager))
})
lRouter.on('/tags/:tag', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () => createTagsPage(mainPage.middle, appManager, params))
  // xxx: need to fix that - we call a constructor twice
  createTagsPage(mainPage.middle, appManager, params)
})
lRouter.on('/status/:server/:webfinger/:id', (params) => createStatusPage(mainPage.middle, appManager, params))

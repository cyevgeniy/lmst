import '../assets/css/main.css'
import { lRouter, RouteParams } from './router'
import { createTimelinePage } from './pages/timeline'
import { createProfilePage } from './pages/profile'
import { createTagsPage } from './pages/tags'
import { createOAuthPage } from './pages/oauth'
import { createComposePage } from './pages/compose'
import { ProfileTimelineManager, AppManager } from './appManager'
import { createStatusPage } from './pages/status'
import { createMainPage } from './utils/page'
import { ElLike } from './utils/dom'
import { usePageHistory } from './utils/pageHistory'
import { createSearchPage } from './pages/search'

const appManager = new AppManager()
const mainPage = createMainPage(appManager.globalMediator)

// const hist = new Map<string, HTMLElement>()
const hist = usePageHistory()

function cacheAndNavigate(path: string, mountpoint: HTMLElement, cb: () => ElLike): void {
  let el = hist.get(path)

  if (!el) {
    el = cb().el
    hist.set(path, el) 
  }

  mountpoint.innerHTML = ''
  mountpoint.appendChild(el)
}

lRouter.on('/', (params) =>{
  cacheAndNavigate(params._path, mainPage.middle, () => createTimelinePage(mainPage.middle, appManager))
})

function _createProfilePage(params: RouteParams) {
  const cb = () => createProfilePage(mainPage.middle, {
    pm: new ProfileTimelineManager(),
    pageMediator: appManager.globalMediator,
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

    toCleanup = pageConstructor()?.onUnmount ?? noop
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
lRouter.on('/search', () => createSearchPage(mainPage.middle, appManager))
lRouter.on('/tags/:tag', (params) => {
  cacheAndNavigate(params._path, mainPage.middle, () => createTagsPage(mainPage.middle, appManager, params))
  createTagsPage(mainPage.middle, appManager, params)
})
lRouter.on('/status/:server/:webfinger/:id', (params) => createStatusPage(mainPage.middle, appManager, params))

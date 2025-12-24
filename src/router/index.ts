import { sanitizePath, getPathParameters } from './router-utils'
import { noop } from '../utils/shared'
import { Page } from '../utils/page'

export interface RouteParams {
  _path: string
  [k: string]: string
}
export type RouteCallback = (params: RouteParams) => void

export interface Router {
  /**
   * Registers callback for specified route
   *
   * @param path path
   * @param cb callback function
   */
  on(path: string, cb: RouteCallback): void

  /**
   * Navigates to specified path and execute router's callbacks for it if any
   */
  navigateTo(path: string): void

  onBeforeEach(cb: () => void): void
}

function createRouter(): Router {
  const callbacks: Map<string, RouteCallback> = new Map()
  /**
   * This one is for the `refreshUserInfo` function.
   * We need to call it BEFORE each route's callback is executed.
   * Because we should aim to smaller bundle size, we use just a single variable.
   */
  let beforeEach: () => void = noop

  function findCallback(path: string): () => void {
    let entries = callbacks.entries(),
      _callback = noop

    for (const [routePath, cb] of entries) {
      const matched = getPathParameters(routePath, path)
      // Always store path in callback parameters
      // It's used for caching content as a key for the history Map structure
      const patchedParams = { ...matched.params, _path: path }

      if (matched.matched) {
        _callback = () => cb(patchedParams)
        break
      }
    }

    return _callback
  }

  /**
   * Executes required `beforeEach` callback and then runs route's callback
   * @param cb Route's callback to execute
   */
  async function runCallback(cb: () => void) {
    if (cb != noop) {
      await Promise.resolve(beforeEach())
      currPage = cb()
    }
  }

  // TODO: Of course, we expect Page or undefined maybe
  let currPage: Page | void = undefined

  window.addEventListener('load', async () => {
    let cb = findCallback(window.location.pathname)

    runCallback(cb)
  })

  window.addEventListener('popstate', async () => {
    let cb = findCallback(window.location.pathname)

    runCallback(cb)
  })

  function on(path: string, cb: (params: RouteParams) => void) {
    callbacks.set(sanitizePath(path), cb)
  }

  function onBeforeEach(cb: () => void) {
    beforeEach = cb
  }

  function navigateTo(path: string) {
    history.pushState({}, '', path)

    // Perform cleanup before navigating to the next page
    if (typeof currPage?.onUnmount === 'function') currPage.onUnmount()

    let cb = findCallback(path)

    runCallback(cb)
  }

  return {
    on,
    navigateTo,
    onBeforeEach,
  }
}

// We need only one router in our app
export let lRouter = createRouter()

import { sanitizePath, getPathParameters } from './router-utils'

export type RouteCallback = (params?: Record<string, string>) => void

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
}

function createRouter(): Router {
  const callbacks: Map<string, RouteCallback> = new Map()

  function findCallback(path: string): () => void {
    const entries = callbacks.entries()

    let _callback = () => {}

    for (const [routePath, cb] of entries) {
      const matched = getPathParameters(routePath, path)

      if (matched.matched) {
        console.log('path=', path, ' routePath=', routePath)
        _callback = () => cb(matched.params)
        break
      }
    }

    return _callback
  }

  window.addEventListener('load', () => {
    console.log('Window load event, pathname = ', window.location.pathname)

    findCallback(window.location.pathname)()
  })

  window.addEventListener('popstate', () => {
    console.log('Window popState event, pathName = ', window.location.pathname)
    findCallback(window.location.pathname)()
//    callbacks.get(window.location.pathname)?.()
  })

  function on(path: string, cb: (params?: Record<string, string>) => void) {
    callbacks.set(sanitizePath(path), cb)
  }

  function navigateTo(path: string) {
    history.pushState({}, '', path)
    findCallback(path)()
  }

  return {
    on,
    navigateTo,
  }
}

export const lRouter = createRouter()
lRouter.on('/profile/:id/question/:questionId', (params) => {console.log('LProfile callback', JSON.stringify(params, null, 2))})
lRouter.on('settings/', (params) => {console.log('LSettings callback', JSON.stringify(params, null, 2))})

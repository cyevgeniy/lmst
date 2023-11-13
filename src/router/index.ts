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
        _callback = () => cb(matched.params)
        break
      }
    }

    return _callback
  }

  window.addEventListener('load', () => {
    findCallback(window.location.pathname)()
  })

  window.addEventListener('popstate', () => {
    findCallback(window.location.pathname)()
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

// We need only one router in our app
export const lRouter = createRouter()

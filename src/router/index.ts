import { sanitizePath } from './router-utils'

export interface Router {
  /**
   * Registers callback for specified route
   *
   * @param path path
   * @param cb callback function
   */
  on(path: string, cb: () => void): void

  /**
   * Navigates to specified path and execute router's callbacks for it if any
   */
  navigateTo(path: string): void
}

function createRouter(): Router {
  const callbacks: Map<string, () => void> = new Map()

  window.addEventListener('load', () => {
    console.log('Window load event, pathname = ', window.location.pathname)
    callbacks.get(window.location.pathname)?.()
  })

  window.addEventListener('popstate', () => {
    console.log('Window popState event, pathName = ', window.location.pathname)
    callbacks.get(window.location.pathname)?.()
  })

  function on(path: string, cb: () => void) {
    callbacks.set(sanitizePath(path), cb)
  }

  function navigateTo(path: string) {
    history.pushState({}, '', path)
    callbacks.get(sanitizePath(path))?.()
  }

  return {
    on,
    navigateTo,
  }
}

export const lRouter = createRouter()
lRouter.on('/profile/:id', () => {console.log('LProfile callback')})
lRouter.on('settings/', () => {console.log('LSettings callback')})


match('/profile/:id', '/profile/hello') //true
match('/profile/:id', '/profile') // false
match('/profile/:id', '/profile/123/4423') // false

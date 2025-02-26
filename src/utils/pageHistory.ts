import { Page } from './page'

export interface PageHistoryManager {
  get: (p: string) => Page | undefined
  set: (p: string, page: Page) => Map<string, Page>
  clear: () => void
}

const hist = new Map<string, Page>()

/**
 * Returns previously opened page for specified route, or,
 * if route is visited for the first time, calls page constructor,
 * adds it to the cache and then returns it
 *
 * @param path Route path
 * @param cb Page constructor
 * @returns Cached or previously created page
 */
export function getCached(path: string, cb: () => Page): Page {
  let page = hist.get(path)

  if (!page) hist.set(path, (page = cb()))

  return page
}

/**
 * Most probably we'll add additional logic into the page caching
 * mechanizm. Right now it's just a wrapper arount a Map
 */
export function usePageHistory(): PageHistoryManager {
  return {
    get: (p: string) => hist.get(p),
    set: (p: string, page: Page) => hist.set(p, page),
    clear: () => hist.clear(),
  }
}

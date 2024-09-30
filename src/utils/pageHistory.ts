import { Page } from "./page"

export interface PageHistoryManager {
  get: (p: string) => Page | undefined
  set: (p: string, page: Page) => Map<string, Page>
  clear: () => void
}

const hist = new Map<string, Page>()


/**
 * Most probably we'll add additional logic into the page caching
 * mechanizm. Right now it's just a wrapper arount a Map 
 */
export function usePageHistory(): PageHistoryManager {
    return {
        get: (p: string) => hist.get(p),
        set: (p: string, page: Page) => hist.set(p, page),
        clear: () => hist.clear()
    }
}
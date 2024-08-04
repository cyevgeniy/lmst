export interface PageHistoryManager {
  get: (p: string) => HTMLElement | undefined
  set: (p: string, el: HTMLElement) => Map<string, HTMLElement>
  clear: () => void
}

const hist = new Map<string, HTMLElement>()


/**
 * Most probably we'll add additional logic into the page caching
 * mechanizm. Right now it's just a wrapper arount a Map 
 */
export function usePageHistory(): PageHistoryManager {
    return {
        get: (p: string) => hist.get(p),
        set: (p: string, el: HTMLElement) => hist.set(p, el),
        clear: () => hist.clear()
    }
}
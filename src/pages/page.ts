export type PageConstructor = () => {
  mount: () => HTMLElement,
  onParamsChange?: (params?: Record<string,string>) => void | Promise<void>
  // onMount?: (params?: Record<string,string>) => void
}

export interface PageInstance {
  mount: (params?: Record<string,string>) => void
}

export function Page(p: PageConstructor): PageInstance {
  function mount(params?: Record<string, string>) {
    // Find root node
    const root = document.getElementById('app')

    if (!root)
      return

    const page = p()
    root.innerHTML = ''
    root.appendChild(page.mount())
    page.onParamsChange?.(params)
  }

  return {
    mount,
  }
}

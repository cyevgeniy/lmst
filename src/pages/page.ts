export type PageConstructor = () => {render: () => HTMLElement, onMount?: (params?: Record<string,string>) => void}

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
    root.appendChild(page.render())
    page.onMount?.(params)
  }

  return {
    mount,
  }
}

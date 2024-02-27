import { LInfo } from "../components/LInfo"
import { Layout } from "../components/Layout"

type PageConstructor = () => {
  mount: (t: any) => HTMLElement,
  onParamsChange?: (params?: Record<string,string>) => void | Promise<void>
}

export interface PageInstance {
  mount: (params?: Record<string,string>) => void
}

export function definePage(p: PageConstructor): PageInstance {
  function mount(params?: Record<string, string>) {
    // Find root node
    const root = document.getElementById('app')

    if (!root)
      return

    const page = p()
    root.innerHTML = ''
    const layout = new Layout(root)
    new LInfo(layout.right)
    layout.middle.appendChild(page.mount())
    page.onParamsChange?.(params)
  }

  return {
    mount,
  }
}

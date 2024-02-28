import { LInfo } from "../components/LInfo"
import { Layout } from "../components/Layout"

export interface IPage {
  mount: (params?: Record<string, string>) => void
}

export class Page {
  protected root: HTMLElement | undefined
  protected layout: Layout

  constructor() {
    this.root = document.getElementById('app') ?? undefined

    if (!this.root)
      throw new Error('Unable to locate application root element')

    this.layout = new Layout(this.root)
    new LInfo(this.layout.right)
  }

  public mount() {
    this.root!.innerHTML = ''
    this.layout = new Layout(this.root!)
    new LInfo(this.layout.right)
  }
}

type PageConstructor = () => {
  mount: () => HTMLElement,
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

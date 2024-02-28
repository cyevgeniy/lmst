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

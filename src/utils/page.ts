import { LInfo } from "../components/LInfo"
import { Layout } from "../components/Layout"
import type { Mediator } from '../types/shared'

export interface IPage {
  mount: (params?: Record<string, string>) => void
}

export class Page  {
  protected root: HTMLElement | undefined
  protected layout: Layout
  private pageMediator: Mediator

  constructor(pm: Mediator) {
    this.pageMediator = pm
    this.root = document.getElementById('app') ?? undefined

    if (!this.root)
      throw new Error('Unable to locate application root element')

    this.layout = new Layout(this.root, this.pageMediator)
    new LInfo(this.layout.right)
  }

  public mount() {
    this.root!.innerHTML = ''
    this.layout = new Layout(this.root!, this.pageMediator)
    new LInfo(this.layout.right)
  }
}

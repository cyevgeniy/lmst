import { div } from "../utils/dom";
import { LNav } from "./LNav";
import type { Mediator } from '../types/shared'


export class Layout {
  public middle: HTMLElement
  public right: HTMLElement
  public footer: HTMLElement
  private pageMediator: Mediator

  constructor(root: HTMLElement, pm: Mediator) {
    this.pageMediator = pm
    this.middle = div('layout__middle')
    this.right = div('layout__right')
    this.footer = div('layout__footer')

    new LNav(root, this.pageMediator)

    root.appendChild(div('layout__container', [
      this.middle,
      this.right,
    ]))

    root.appendChild(this.footer)
  }
}

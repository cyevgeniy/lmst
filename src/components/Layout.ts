import { div } from "../utils/dom";
import { LNav } from "./LNav";

export class Layout {
  public middle: HTMLElement
  public right: HTMLElement
  public footer: HTMLElement

  constructor(root: HTMLElement) {
    this.middle = div('layout__middle')
    this.right = div('layout__right')
    this.footer = div('layout__footer')

    new LNav(root)

    root.appendChild(div('layout__container', [
      this.middle,
      this.right,
    ]))
  
    root.appendChild(this.footer)
  }
}
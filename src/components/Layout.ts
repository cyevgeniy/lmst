import { div } from "../utils/dom";
import { LNav } from "./LNav";
import type { Mediator } from '../types/shared'

export function createLayout(root: HTMLElement, pm: Mediator) {
  const middle = div('layout__middle')
  const right = div('layout__right')
  const footer = div('layout__footer')

  new LNav(root, pm)

  root.appendChild(div('layout__container', [
    middle,
    right,
  ]))

  root.appendChild(footer)

  return {
    middle,
    right,
    footer,
  }
}
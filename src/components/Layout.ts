import { childs, div } from '../utils/dom'
import { LNav } from './LNav'
import type { GlobalNavigation } from '../types/shared'

export function createLayout(root: HTMLElement, gn: GlobalNavigation) {
  let middle = div('layout__middle'),
    right = div('layout__right'),
    footer = div('layout__footer')

  childs(root, [LNav(gn), div('layout__container', [middle, right]), footer])

  return {
    middle,
    right,
    footer,
  }
}

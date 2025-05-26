import { childs, div } from '../utils/dom'
import { LNav } from './LNav'
import type { GlobalNavigation } from '../types/shared'

export function createLayout(root: HTMLElement, gn: GlobalNavigation) {
  let middle = div('ltMiddle'),
    right = div('ltRight'),
    footer = div('ltFooter')

  childs(root, [LNav(gn), div('ltContainer', [middle, right]), footer])

  return {
    middle,
    right,
    footer,
  }
}

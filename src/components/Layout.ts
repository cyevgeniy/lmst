import { childs, div } from '../utils/dom'
import { LNav } from './LNav'

export function createLayout(root: HTMLElement) {
  let middle = div('ltMiddle'),
    right = div('ltRight'),
    footer = div('ltFooter')

  childs(root, [LNav(), div('ltContainer', [middle, right]), footer])

  return {
    middle,
    right,
    footer,
  }
}

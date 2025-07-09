import { lRouter } from '../router'
import { h } from '../utils/dom'
import type { Account } from '../types/shared'

export function LProfileLink(
  a: Account,
  childs?: HTMLElement[],
): HTMLAnchorElement {
  return h(
    'a',
    {
      attrs: {
        href: `/profile/${a.acct}/`,
      },
      onClick: (e) => {
        e.preventDefault()
        lRouter.navigateTo(`/profile/${a.acct}/`)
      },
    },
    childs,
  )
}

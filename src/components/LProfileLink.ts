import { lRouter } from '../router'
import { h } from '../utils/dom'
import type { Account } from '../types/shared'

// TODO: use this function in a LStatus component
export function LProfileLink(a: Account): HTMLAnchorElement {
  return h('a', {
    attrs: {
      href: `/profile/${a.acct}/`
    },
    onClick: (e) => {
      e.preventDefault()
      lRouter.navigateTo(`/profile/${a.acct}/`)
    }
  })
}

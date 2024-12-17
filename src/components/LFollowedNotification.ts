import { LProfileLink } from '../components/LProfileLink'
import { h } from '../utils/dom'
import type { Notification } from '../types/shared'

export function LFollowedNotification(n: Notification) {
  let profileLink = Object.assign(LProfileLink(n.account), {innerText: n.account.display_name || n.account.username}),
  el = h('div', null, [profileLink])

  el.innerHTML += ' followed you'

  return {el}
}


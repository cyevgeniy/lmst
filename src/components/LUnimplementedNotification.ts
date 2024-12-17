import { LProfileLink } from '../components/LProfileLink'
import { h } from '../utils/dom'
import type { Notification } from '../types/shared'

export function LUnimplementedNotification(n: Notification) {
  // @ts-expect-error we know that there will be only these types
  let txt = {
    follow_request: 'is requested to follow you',
    poll: 'a poll has ended',
    update: 'has posted a status',
    'admin.sign_up': 'signed up',
    'admin.report': ': a new report has been filed',
    'severed_relationships': 'Some of your follow relationships have been severed as a result of a moderation or block event',
  }[n.type] ?? `sorry, this notification is unimplemented its type: ${n.type}`

  let profileLink = Object.assign(LProfileLink(n.account), {innerText: n.account.display_name || n.account.acct}),
  el = h('div', null, [profileLink])

  el.innerHTML += ' ' + txt

  return {el}
}


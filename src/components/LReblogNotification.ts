import { LStatus } from '../components/LStatus'
import { LAvatarLink } from '../components/LAvatarLink'
import { div, h } from '../utils/dom'
import type { Notification } from '../types/shared'

export function LReblogNotification(n: Notification) {
  let text = n.type === 'reblog' ? 'reblogged' : 'bookmarked your status',
  profile = div('notificationReblog__profile', [
    LAvatarLink(n.account).el,
    h('p', null, `${n.account.display_name} ${text}:`)
  ]),
  el = div('notification--reblog', [
    profile,
    LStatus({status: n.status!}).el,
  ])

  return {
    el
  }
}

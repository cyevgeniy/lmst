import { LStatus } from '../components/LStatus'
import { LAvatarLink } from '../components/LAvatarLink'
import { h } from '../utils/dom'
import type { Notification } from '../types/shared'

export function LReblogNotification(n: Notification) {
  let text = n.type === 'reblog' ? 'reblogged' : 'bookmarked your status',
  profile = h('div', {className: 'notificationReblog__profile'}, [
    LAvatarLink(n.account).el,
    h('p', null, `${n.account.display_name} ${text}:`)
  ]),
  el = h('div', { className: 'notification--reblog'}, [
    profile,
    LStatus({status: n.status!}).el,
  ])

  return {
    el
  }
}

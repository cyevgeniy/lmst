import { LStatus } from '../components/LStatus'
import { LAvatarLink } from '../components/LAvatarLink'
import { h } from '../utils/dom'
import type { Notification } from '../types/shared'

export function LReblogNotification(n: Notification) {
  let profile = h('div', {className: 'notificationReblog__profile'}, [
    LAvatarLink(n.account).el,
    h('p', null, `${n.account.display_name} reblogged:`)
  ]),
  el = h('div', { className: 'notification--reblog'}, [
    profile,
    LStatus({status: n.status!}).el,
  ])

  return {
    el
  }
}

import { h, childs, hide, show } from '../utils/dom'
import { on } from '../utils/signal'
import { notificationsStore as ns } from '../store/notificationsStore'
import { LStatus } from '../components/LStatus'
import { LButton } from '../components/LButton'
import { LFollowedNotification } from '../components/LFollowedNotification'
import { LReblogNotification } from '../components/LReblogNotification'
import type { Notification } from '../types/shared'

export function createNotificationsPage(root: HTMLElement) {
  root.innerHTML = ''
  let dismissBtn = LButton({
    text: 'Clear all notifications',
    onClick: ns.dismissAll,
    className: 'notifications-clear',
  }),
  actions = h('div', {className: 'notification-actions'}, [dismissBtn.el]),
  noData = h('div', {className: 'notification-noData'}, 'You have no unread notifications'),
  nRoot = h('div', { className: 'notifications-root'}),
  el = h('div', null, [
    actions,
    nRoot
  ])

  // Initially, hide actions block, because if there're no
  // notifications, it will be visible during fetch, while we want to show it
  // only when we definitely know that notifications are exist
  hide(actions)

  function getNotificationNode(n: Notification): HTMLDivElement {
    switch (n.type) {
      case 'follow': return LFollowedNotification(n).el
      case 'reblog': return LReblogNotification(n).el
      case 'mention': return LStatus({status: n.status!}).el
      case 'favourite': return LReblogNotification(n).el
      default: return h('div', null, 'Unhandled notification ')
    }
  }

  function renderNotifications() {
      for (const n of ns.notifications()) {
        nRoot.appendChild(getNotificationNode(n))
      }
  }

  on(ns.notifications, () => {
    nRoot.innerHTML = ''
    renderNotifications()
    if (!ns.notifications().length) {
      hide(actions)
      childs(nRoot, [noData])
    }
    else
      show(actions)
  })

  if (ns.notifications().length === 0)
    ns.getNotifications()
  else
    renderNotifications()

  root.appendChild(el)

  return {
    el,
  }
}

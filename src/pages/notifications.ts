import { div, h, childs, hide, show } from '../utils/dom'
import { on } from '../utils/signal'
import { notificationsStore as ns } from '../store/notificationsStore'
import { LStatus } from '../components/LStatus'
import { LButton } from '../components/LButton'
import { LFollowedNotification } from '../components/LFollowedNotification'
import { LNotificationWithStatus } from '../components/LNotificationWithStatus'
import { LUnimplementedNotification } from '../components/LUnimplementedNotification'
import type { Notification } from '../types/shared'

export function createNotificationsPage(root: HTMLElement) {
  root.innerHTML = ''
  let dismissBtn = LButton({
      text: 'Clear all notifications',
      onClick: ns.dismissAll,
      className: 'notifications-clear',
    }),
    actions = div('notification-actions', [dismissBtn.el]),
    noData = h(
      'div',
      { className: 'notification-noData' },
      'You have no unread notifications',
    ),
    nRoot = div('notifications-root'),
    el = h('div', null, [actions, nRoot])

  // Initially, hide actions block, because if there're no
  // notifications, it will be visible during fetch, while we want to show it
  // only when we definitely know that notifications are exist
  hide(actions)

  function getNotificationNode(n: Notification): HTMLDivElement {
    switch (n.type) {
      case 'follow':
        return LFollowedNotification(n).el
      case 'mention':
        return LStatus({ status: n.status! }).el
      case 'favourite':
      case 'reblog':
      case 'update':
        return LNotificationWithStatus(n).el
      default:
        return LUnimplementedNotification(n).el
    }
  }

  function renderNotifications() {
    for (const n of ns.notifications())
      nRoot.appendChild(getNotificationNode(n))
  }

  let onUnmount = on(ns.notifications, () => {
    nRoot.innerHTML = ''
    renderNotifications()
    if (!ns.notifications().length) {
      hide(actions)
      childs(nRoot, [noData])
    } else show(actions)
  })

  ns.getNotifications()

  childs(root, [el])

  return {
    el,
    onUnmount,
  }
}

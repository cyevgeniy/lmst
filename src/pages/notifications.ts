import { h } from '../utils/dom'
import { notificationsStore as ns } from '../store/notificationsStore'
import { LStatus } from '../components/LStatus'
import { LFollowedNotification } from '../components/LFollowedNotification'
import { LReblogNotification } from '../components/LReblogNotification'
import type { Notification } from '../types/shared'

export function createNotificationsPage(root: HTMLElement) {
  root.innerHTML = ''
  let el = h('div', { className: 'notifications-root'})

  function getNotificationNode(n: Notification): HTMLDivElement {
    switch (n.type) {
      case 'follow': return LFollowedNotification(n).el
      case 'reblog': return LReblogNotification(n).el
      case 'mention': return LStatus({status: n.status!}).el
      default: return h('div', null, 'Unhandled notification ')
    }
  }

  function renderNotifications() {
      for (const n of ns.notifications()) {
        el.appendChild(getNotificationNode(n))
      }
  }

  if (ns.notifications().length === 0) {
    ns.getNotifications().then(() => {
      renderNotifications()
    })
  } else {
    renderNotifications()

  }

  root.appendChild(el)

  return {
    el,
  }
}

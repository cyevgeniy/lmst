import { h } from '../utils/dom'
import { notificationsStore as ns } from '../store/notificationsStore'
import { LStatus } from '../components/LStatus'
import type { Notification } from '../types/shared'

export function createNotificationsPage(root: HTMLElement) {
  root.innerHTML = ''
  let el = h('div', { className: 'notifications-root'})

  function getNotificationNode(n: Notification): HTMLDivElement {
    switch (n.type) {
      case 'follow': return h('div', null, `you was followed by ${n.account.display_name}`)
      case 'reblog': return LStatus({status: n.status!}).el
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

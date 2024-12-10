import type { Notification } from '../types/shared'
import { fetchJson } from '../utils/fetch.ts'
import { useAppConfig } from '../appConfig'
import { createSignal } from '../utils/signal'

function createNotificationManager() {
  let { server } = useAppConfig(),
  notifications = createSignal<Notification[]>([])

  async function getNotifications() {
    try {
      let res = await fetchJson<Notification[]>(`${server()}/api/v1/notifications?limit=30`, {
        withCredentials: true,
      })
      notifications(res)
    }
    catch(e) {
      notifications([])
    }
  }

  return {
    notifications,
    getNotifications
  }
}

export let notificationsStore = createNotificationManager()

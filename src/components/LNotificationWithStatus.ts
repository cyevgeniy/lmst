import { LStatus } from '../components/LStatus'
import { LAvatarLink } from '../components/LAvatarLink'
import { div, h } from '../utils/dom'
import type { Notification, NotificationType } from '../types/shared'

type SupportedTypes = Extract<
  NotificationType,
  'reblog' | 'update' | 'favourite'
>
interface SupportedNotification extends Notification {
  type: SupportedTypes
}

export function LNotificationWithStatus(n: SupportedNotification) {
  let text = {
      reblog: 'reblogged',
      update: 'updated his status',
      favourite: 'bookmarked your status',
    }[n.type],
    profile = div('nfReblog__profile', [
      LAvatarLink(n.account).el,
      h('p', null, `${n.account.display_name} ${text}:`),
    ]),
    el = div('nfReblog', [profile, LStatus({ status: n.status! }).el])

  return {
    el,
  }
}

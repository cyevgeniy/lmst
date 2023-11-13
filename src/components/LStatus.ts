import type { Status, MediaAttachment } from '../types/shared'
import { h } from '../utils/dom'
import { lRouter } from '../router'

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

export function LStatus(status: Status) {
  const avatar =     h('img', {class: 'avatar', attrs: {src: `${status.account?.avatar ?? 'assets/img/no-avatar.webp'}` }})
  const attachments = status.media_attachments.length > 0 ? h('div', {class: 'status-attachment-container'}) : undefined
  attachments && status.media_attachments.forEach(attachment => {
    if (attachment.type === 'image') {
      attachments.appendChild(h('img', {class: 'status-attachment--image', attrs: {src: attachment.preview_url}}))
    }
  })

  const el = h('div', {class: 'status'}, [
    h('div', {class: 'status__header'}, [
      avatar,
      h('span', null, `${status.account?.display_name || ''}`),
      h('span', {class: 'status__create-date'}, `${ fmtDate(status.created_at) ?? ''}`),
    ]),
    h('div', {innerHTML: status.content}),
    attachments
  ])

  avatar.addEventListener('click', () => {
    lRouter.navigateTo(`/profile/${status.id}`)
  })

  return { el }
}

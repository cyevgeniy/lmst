import type { Status, MediaAttachment } from '../types/shared'
import { h } from '../utils/dom'
import { lRouter } from '../router'
import { Avatar } from './Avatar'

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

function attachmentNode(attachment: MediaAttachment): HTMLElement | undefined {
  if (attachment.type === 'image')
    return h('img', {
      class: 'status-attachment--image',
      attrs: {src: attachment.preview_url}
    })
  else
    return undefined
}

export function LStatus(status: Status) {

  let rendered = false

  let el: HTMLElement
  let avatar: HTMLElement
  let attachments: HTMLElement | undefined

  function render() {
    avatar =  Avatar(status.account?.avatar).mount()
    attachments = status.media_attachments.length > 0 ? h('div', {class: 'status-attachment-container'}) : undefined
    if (attachments !== undefined) {
      status.media_attachments.forEach(attachment => {
        const node = attachmentNode(attachment)
        if (node)
          attachments!.appendChild(node)
      })
    }

    el = h('div', {class: 'status'}, [
      h('div', {class: 'status__header'}, [
        avatar,
        h('div', {class: 'status__username'}, [
          h('span', null, `${status.account?.display_name || ''}`),
          h('a', {attrs: {href: `${status.account?.url}`, target: '_blank'}, class: 'username__acc'}, `${status.account?.acct || ''}`),
        ]),
        h('span', {class: 'status__create-date'}, `${ fmtDate(status.created_at) ?? ''}`),
      ]),
      h('div', {innerHTML: status.content}),
      attachments
    ])
  }

  /**
   * Creates HTML elements for the component,
   * adds all required event listeners and
   * returns the root HTMLElement for the component
   */
  function mount() {
    if (!rendered) {
      render()
      avatar.addEventListener('click', () => {
        lRouter.navigateTo(`/profile/${status.account.id}`)
      })

      rendered = true
    }

    return el
  }

  return { mount }
}

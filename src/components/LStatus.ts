import type { Status, MediaAttachment } from '../types/shared'
import { h, a, div, span } from '../utils/dom'
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
    const mediaCnt = status.media_attachments.length
    const contClass = mediaCnt > 1 ? 'status-attachment-container--2col' : 'status-attachment-container'
    attachments = mediaCnt > 0 ? div(contClass) : undefined
    if (attachments !== undefined) {
      status.media_attachments.forEach(attachment => {
        const node = attachmentNode(attachment)
        if (node)
          attachments!.appendChild(node)
      })
    }

    el = div('status', [
      div('status__header', [
        avatar,
        div('status__username', [
          span('', `${status.account?.display_name || ''}`),
          a('username__acc', `${status.account?.url}`,  `${status.account?.acct || ''}`),
        ]),
        span('status__create-date', `${ fmtDate(status.created_at) ?? ''}`),
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

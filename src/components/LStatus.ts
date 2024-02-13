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
  
  if (['gifv', 'video'].includes(attachment.type))
    return h('video', {
      class: 'status-attachment--video',
      attrs: {
        src: attachment.url,
        controls: '',
      }
    })
  else
    return undefined
}

export function LStatus(status: Status) {

  const _status = status.reblog ?? status
  const isReblogged = Boolean(status.reblog)

  let rendered = false

  let el: HTMLElement
  let avatar: HTMLElement
  let attachments: HTMLElement | undefined
  let sensitiveEl: HTMLElement | undefined
  let sensitiveBtn: HTMLButtonElement | undefined

  function getAttachmentsEl(): HTMLElement | undefined {
    const mediaCnt = _status.media_attachments.length
    const contClass = mediaCnt > 1 ? 'status-attachment-container--2col' : 'status-attachment-container'
    const result = mediaCnt > 0 ? div(contClass) : undefined

    result && _status.media_attachments.forEach(attachment => {
      const node = attachmentNode(attachment)
      if (node)
        result!.appendChild(node)
    })

    return result

  }

  function render() {
    avatar =  Avatar(_status.account?.avatar).mount()

    if (!_status.sensitive)
      attachments = getAttachmentsEl()

    const dispName = status.account.display_name

    sensitiveBtn = h('button', null, 'Show me tits!') as HTMLButtonElement

    sensitiveEl = _status.sensitive ? h('div', null, [sensitiveBtn]): undefined

    el = div('status', [
      isReblogged ? div('status--boosted', [span('', `${dispName} boosted: `)]) : undefined,
      div('status__header', [
        avatar,
        div('status__username', [
          span('', `${_status.account?.display_name || ''}`),
          a('username__acc', `${_status.account?.url}`,  `${_status.account?.acct || ''}`),
        ]),
        span('status__create-date', `${ fmtDate(status.created_at) ?? ''}`),
      ]),
      _status.sensitive ? undefined : h('div', {innerHTML: _status.content}),
      _status.sensitive ? sensitiveEl : attachments,
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
        lRouter.navigateTo(`/profile/${_status.account.id}`)
      })

      sensitiveBtn?.addEventListener('click', () => {
        sensitiveEl?.remove()
        attachments = getAttachmentsEl()
        _status.content && el.appendChild(h('div', {innerHTML: _status.content}))
        attachments && el.appendChild(attachments)
      })

      rendered = true
    }

    return el
  }

  return { mount }
}

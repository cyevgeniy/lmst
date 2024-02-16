import type { Status, MediaAttachment } from '../types/shared'
import { h, a, div, span } from '../utils/dom'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'

export class LStatus {
  public el: HTMLElement
  private avatar: LAvatar
  private attachments: HTMLElement | undefined
  private sensitiveEl: HTMLElement | undefined
  private sensitiveBtn: HTMLButtonElement | undefined
  private _status: Status
  private renderedStatus: Status
  private isReblogged: boolean

  constructor(status: Status) {
    this._status = status.reblog ?? status
    this.isReblogged = Boolean(status.reblog)
    this.renderedStatus = status
    this.avatar = new LAvatar(this._status.account?.avatar)


    if (!this._status.sensitive)
      this.attachments = this.getAttachmentsEl()

    const dispName = this.renderedStatus.account.display_name

    this.sensitiveBtn = h('button', null, 'Show me tits!') as HTMLButtonElement

    this.sensitiveEl = this._status.sensitive ? h('div', null, [this.sensitiveBtn]) : undefined

    this.el = div('status', [
      this.isReblogged ? div('status--boosted', [span('', `${dispName} boosted: `)]) : undefined,
      div('status__header', [
        this.avatar.el,
        div('status__username', [
          span('', `${this._status.account?.display_name || ''}`),
          a('username__acc', `${this._status.account?.url}`, `${this._status.account?.acct || ''}`),
        ]),
        span('status__create-date', `${fmtDate(this.renderedStatus.created_at) ?? ''}`),
      ]),
      this._status.sensitive ? undefined : h('div', { innerHTML: this._status.content }),
      this._status.sensitive ? this.sensitiveEl : this.attachments,
    ])

    this.addEventListeners()
  }

  private getAttachmentsEl(): HTMLElement | undefined {
    const mediaCnt = this._status.media_attachments.length
    const contClass = mediaCnt > 1 ? 'status-attachment-container--2col' : 'status-attachment-container'
    const result = mediaCnt > 0 ? div(contClass) : undefined

    result && this._status.media_attachments.forEach(attachment => {
      const node = this.attachmentNode(attachment)
      if (node)
        result!.appendChild(node)
    })

    return result

  }

  private attachmentNode(attachment: MediaAttachment): HTMLElement | undefined {
    if (attachment.type === 'image')
      return h('img', {
        class: 'status-attachment--image',
        attrs: { src: attachment.preview_url }
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

  private addEventListeners() {
    this.avatar.onImageClick(() => {
      lRouter.navigateTo(`/profile/${this._status.account.id}`)
    })

    this.sensitiveBtn?.addEventListener('click', () => {
      this.sensitiveEl?.remove()
      this.attachments = this.getAttachmentsEl()
      this._status.content && this.el.appendChild(h('div', { innerHTML: this._status.content }))
      this.attachments && this.el.appendChild(this.attachments)
    })

  }
}

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

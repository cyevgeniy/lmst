import type { Status, MediaAttachment } from '../types/shared'
import { h, a, div, span, button } from '../utils/dom'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'
import { LStatusButtons } from './LStatusButtons'
import { onClick } from '../utils/events'

export type StatusCallback = (s: Status) => void

export class LStatus {
  public el: HTMLElement
  // Link wrapper for avatar
  private avatarLink: HTMLAnchorElement
  private avatar: LAvatar
  private attachments: HTMLElement | undefined
  private sensitiveEl: HTMLElement | undefined
  private sensitiveBtn: HTMLButtonElement | undefined
  //private actions: HTMLSelectElement | undefined
  private _status: Status
  private renderedStatus: Status
  private isReblogged: boolean
  private statusButtons: LStatusButtons
  private _onBoost: StatusCallback | undefined = undefined
  private _onBookmark: StatusCallback | undefined = undefined

  constructor(status: Status) {
    this._status = status.reblog ?? status
    this.isReblogged = Boolean(status.reblog)
    this.renderedStatus = status

    this.avatar = new LAvatar(this._status.account?.avatar)
    this.statusButtons = new LStatusButtons(status)
    this.statusButtons.onBoostClick(() => {
      this._onBoost && this._onBoost(this.renderedStatus)
    })
    this.statusButtons.onBookmarkClick(() => {
      this._onBookmark && this._onBookmark(this.renderedStatus)
    })

    // xxx: Create Combobox component instead
    /* this.actions = h('select', null, [
      h('option', {attrs: {value: ''}}, 'Actions:'),
      h('option', {attrs: {value: 'bookmark'}}, 'Bookmark'),
      h('option', {attrs: {value: 'reply'}}, 'Reply'),
      h('option', {attrs: {value: 'report'}}, 'Report'),
    ]) as HTMLSelectElement */


    if (!this._status.sensitive)
      this.attachments = this.getAttachmentsEl()

    const dispName = this.renderedStatus.account.display_name

    this.sensitiveBtn = button('', 'Show sensitive content')

    this.sensitiveEl = this._status.sensitive ? h('div', {class: 'show-sensitive-content'}, [this.sensitiveBtn]) : undefined

    this.avatarLink = h('a', {attrs: {href: `/profile/${this._status.account.id}`}}, [this.avatar.el])

    this.el = div('status', [
      this.isReblogged ? div('status--boosted', [span('', `${dispName} boosted: `)]) : undefined,
      div('status__header', [
        this.avatarLink,
        div('status__username', [
          span('', `${this._status.account?.display_name || ''}`),
          a('username__acc', `${this._status.account?.url}`, `${this._status.account?.acct || ''}`),
        ]),
        span('status__create-date', `${fmtDate(this.renderedStatus.created_at) ?? ''}`),
      ]),
      this._status.sensitive ? undefined : h('div', { innerHTML: this._status.content }),
      this._status.sensitive ? this.sensitiveEl : this.attachments,
     // this.statusButtons.el,
      //this.actions,
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
      return h('a', {attrs: {href: attachment.preview_url, target: '_blank'}, class: 'status-attachment--link' }, [h('img', {
        class: 'status-attachment--image',
        attrs: { src: attachment.preview_url }
      })])

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
    onClick(this.avatarLink, (e: MouseEvent) => {
      e.preventDefault()
      lRouter.navigateTo(`/profile/${this._status.account.id}`)
    })


    this.sensitiveBtn?.addEventListener('click', () => {
      this.sensitiveEl?.remove()
      this.attachments = this.getAttachmentsEl()
      this._status.content && this.el.appendChild(h('div', { innerHTML: this._status.content }))
      this.attachments && this.el.appendChild(this.attachments)
    })

    /* this.actions!.addEventListener('change', () => {
      if (this.actions!.value === 'bookmark')
        this.statusActions.bookmark(this.renderedStatus.id)

      this.actions!.value = ''
    }) */
  }

  public onBoost(fn: StatusCallback) {
    this._onBoost = fn
  }

  public onBookmark(fn: StatusCallback) {
    this._onBookmark = fn
  }
}

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

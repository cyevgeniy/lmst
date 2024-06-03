import type { Status, MediaAttachment } from '../types/shared'
import { h, a, div, span, button } from '../utils/dom'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'
import { LStatusButtons } from './LStatusButtons'
import type { ActionPermissions } from './LStatusButtons'
import { onClick } from '../utils/events'
import { parseContent } from '../utils/shared'

type StatusBoostCallback = (s: Status, boosted: boolean) => void
type StatusDeleteCallback = (s: Status) => void

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
  private _onBoost: StatusBoostCallback  | undefined = undefined
  private _onDelete: ((status: Status) => void) | undefined = undefined

  constructor(opts: {
    status: Status,
    permissions: ActionPermissions
  }) {
    const {
      status,
      permissions = { canDelete: false, canBoost: false }
    } = opts

    this._status = status.reblog ?? status
    this.isReblogged = Boolean(status.reblog)
    this.renderedStatus = status

    this.avatar = new LAvatar(this._status.account?.avatar)
    this.statusButtons = new LStatusButtons({status, permissions})
    this.statusButtons.onBoostClick((boosted: boolean) => {
      this._onBoost && this._onBoost(this._status, boosted)
    })
    this.statusButtons.onDeleteClick((status) => {
      this._onDelete && this._onDelete(status)
    })
    // xxx: Create Combobox component instead
    //  this.actions = h('select', null, [
    //   h('option', {attrs: {value: ''}}, 'Actions:'),
    //   h('option', {attrs: {value: 'bookmark'}}, 'Bookmark'),
    //   h('option', {attrs: {value: 'reply'}}, 'Reply'),
    //   h('option', {attrs: {value: 'report'}}, 'Report'),
    // ]) as HTMLSelectElement


    if (!this._status.sensitive)
      this.attachments = this.getAttachmentsEl()

    const dispName = this.renderedStatus.account.display_name

    this.sensitiveBtn = button('', 'Show sensitive content')

    this.sensitiveEl = this._status.sensitive
      ? h('div', {class: 'show-sensitive-content'}, [this.sensitiveBtn])
      : undefined

    this.avatarLink = h('a', {
      attrs: {
        href: `/profile/${this._status.account.acct}/`
      }
    }, [this.avatar.el])

    this.el = div('status', [
      this.isReblogged
        ? div( 'status--boosted', [span('', `${dispName} boosted: `)])
        : undefined,
      div('status__header', [
        this.avatarLink,
        div('status__username', [
          span('', `${this._status.account?.display_name || ''}`),
          this.linkToAccount(),
        ]),
        span('status__create-date', `${this.getCreateDate()}`),
      ]),
      this._status.sensitive
        ? undefined
        : h('div', {class: 'status__content', innerHTML: parseContent(this._status.content)} ),
      this._status.sensitive
        ? this.sensitiveEl
        : this.attachments,
      this.statusButtons.el,
      //this.actions,
    ])

    this.addEventListeners()
  }

  private linkToAccount() {
    return a(
      'username__acc',
      this._status.account?.url,
      this._status.account?.acct || ''
    )
  }

  private getCreateDate() {
    return fmtDate(this.renderedStatus.created_at) ?? ''
  }

  private getAttachmentsEl(): HTMLElement | undefined {
    const mediaCnt = this._status.media_attachments.length
    const contClass = mediaCnt > 1
      ? 'status-attachment-container--2col'
      : 'status-attachment-container'

    const result = mediaCnt > 0
      ? div(contClass)
      : undefined

    result && this._status.media_attachments.forEach(attachment => {
      const node = this.attachmentNode(attachment)
      node && result.appendChild(node)
    })

    return result

  }

  private attachmentNode(attachment: MediaAttachment): HTMLElement | undefined {
    if (attachment.type === 'image')
      return h('a', {
        attrs: {
          href: attachment.preview_url,
          target: '_blank'
        },
        class: 'status-attachment--link'
      },
      [
        h('img', {
        class: 'status-attachment--image',
        attrs: { src: attachment.preview_url }
        })
      ])

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
      lRouter.navigateTo(`/profile/${this._status.account.acct}/`)
    })


    this.sensitiveBtn?.addEventListener('click', () => {
      this.sensitiveEl?.remove()
      this.attachments = this.getAttachmentsEl()
      this._status.content && this.el.appendChild(h('div', { innerHTML: this._status.content }))
      this.attachments && this.el.appendChild(this.attachments)
    })
  }

  public onBoost(fn: StatusBoostCallback) {
    this._onBoost = fn
  }

  public onDelete(fn: StatusDeleteCallback) {
    this._onDelete = fn
  }
}

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

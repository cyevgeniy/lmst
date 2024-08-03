import type { Status, MediaAttachment } from '../types/shared'
import { h, a, div, span } from '../utils/dom'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'
import { LStatusButtons } from './LStatusButtons'
import type { ActionPermissions } from './LStatusButtons'
import { onClick } from '../utils/events'
import { parseContent } from '../utils/shared'
import { LButton } from './LButton'

type StatusBoostCallback = (s: Status, boosted: boolean) => void
type StatusDeleteCallback = (s: Status) => void
type StatusContentClickCallback = (s: Status) => void

export class LStatus {
  public el: HTMLElement
  // Link wrapper for avatar
  private avatarLink: HTMLAnchorElement
  private avatar: ReturnType<typeof LAvatar>
  private attachments: HTMLElement | undefined
  private sensitiveEl: HTMLElement | undefined
  private statusContent: HTMLDivElement | undefined
  private clickableContent: boolean
  private _status: Status
  private renderedStatus: Status
  private isReblogged: boolean
  private statusButtons: LStatusButtons
  private _onBoost: StatusBoostCallback  | undefined = undefined
  private _onDelete: StatusDeleteCallback | undefined = undefined
  private _onContentClick: StatusContentClickCallback | undefined = undefined

  constructor(opts: {
    status: Status,
    permissions?: ActionPermissions,
    clickableContent?: boolean
    singleView?: boolean
  }) {
    const {
      status,
      permissions = { canDelete: false, canBoost: false },
	  clickableContent = true
    } = opts

	this.clickableContent = clickableContent
    this._status = status.reblog ?? status
    this.isReblogged = Boolean(status.reblog)
    this.renderedStatus = status

    this.avatar = LAvatar({img: this._status.account.avatar})
    this.statusButtons = new LStatusButtons({status, permissions})
    this.statusButtons.onBoostClick((boosted: boolean) => {
      this._onBoost && this._onBoost(this._status, boosted)
    })
    this.statusButtons.onDeleteClick((status) => {
      this._onDelete && this._onDelete(status)
    })

    if (!this._status.sensitive)
      this.attachments = this.getAttachmentsEl()

    const dispName = this.renderedStatus.account.display_name

    this.sensitiveEl = this._status.sensitive
      ? h('div', {className: 'status-sensitiveContent'}, [this.createSensitiveButton().el])
      : undefined

    this.avatarLink = h('a', {
      attrs: {
        href: `/profile/${this._status.account.acct}/`
      }
    }, [this.avatar.el])

    this.statusContent = this._status.sensitive
      ? undefined
      : h('div', {className: ['status-content', this.clickableContent ? 'status-content--clickable': ''], innerHTML: parseContent(this._status.content)} )

    this.el = div(['status', opts.singleView ? 'status--isSingle' : ''], [
      this.isReblogged
        ? div( 'status-boostedText', [span('', `${dispName} boosted: `)])
        : undefined,
      div('status-header', [
        this.avatarLink,
        div('status-profileInfo', [
          span('status-profileName', `${this._status.account?.display_name || ''}`),
          this.linkToAccount(),
        ]),
        span('status-createDate', `${this.getCreateDate()}`),
      ]),
      this.statusContent,
      this._status.sensitive
        ? this.sensitiveEl
        : this.attachments,
      this.statusButtons.el,
    ])

    this.addEventListeners()
  }

  private createSensitiveButton() {
    return LButton({className: 'status-showSensitiveContent', text: 'Show sensitive content', onClick: () => this.onShowSensitiveClick()})
  }

  set withBorder(v: boolean) {
    v && this.el.classList.add('status--withBorder')
  }

  private linkToAccount() {
    return a(
      'status-profileLink',
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
      ? 'status-attachment2Col'
      : 'status-attachment'

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
        className: 'status-linkAttachment'
      },
      [
        h('img', {
        className: 'status-imageAttachment',
        attrs: { src: attachment.preview_url }
        })
      ])

    if (['gifv', 'video'].includes(attachment.type))
      return h('video', {
        className: 'status-videoAttachment',
        attrs: {
          src: attachment.url,
          controls: '',
        }
      })
    else
      return undefined
  }

  private onShowSensitiveClick()  {
    this.sensitiveEl?.remove()
    this.attachments = this.getAttachmentsEl()
    this._status.content && this.el.appendChild(h('div', { innerHTML: this._status.content }))
    this.attachments && this.el.appendChild(this.attachments)
  }

  private addEventListeners() {
    onClick(this.avatarLink, (e: MouseEvent) => {
      e.preventDefault()
      lRouter.navigateTo(`/profile/${this._status.account.acct}/`)
    })

	this.clickableContent && this.statusContent?.addEventListener('click', (e: MouseEvent) => {
    if (e.target instanceof HTMLParagraphElement) {
      // Don't redirect to the single status view if some text is selected -
      // we only redirect on click
      const selection = window.getSelection()
      if (selection?.type !== 'Range')
          this._onContentClick?.(this._status)
    }
  })
  }

  public onBoost(fn: StatusBoostCallback) {
    this._onBoost = fn
  }

  public onDelete(fn: StatusDeleteCallback) {
    this._onDelete = fn
  }

  public onContentClick(fn: StatusContentClickCallback) {
    this._onContentClick = fn
  }
}

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

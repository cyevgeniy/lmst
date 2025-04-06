import type {
  Status,
  MediaAttachment,
  StatusEventHandlers,
} from '../types/shared'
import { h, a, div, span } from '../utils/dom'
import { fmtDate } from '../utils/dates'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'
import { LStatusButtons } from './LStatusButtons'
import type { ActionPermissions } from './LStatusButtons'
import { parseContent, noop } from '../utils/shared'
import { LButton } from './LButton'

type StatusProps = {
  status: Status
  permissions?: ActionPermissions
  clickableContent?: boolean
  singleView?: boolean
} & StatusEventHandlers

export function LStatus(opts: StatusProps) {
  let {
    status,
    permissions = { canDelete: false, canBoost: false },
    clickableContent = true,
    singleView = false,
    onContentClick = noop,
    ...statuButtonsHandlers
  } = opts

  let _status = status.reblog ?? status,
    isReblogged = Boolean(status.reblog),
    renderedStatus = status,
    createDate = fmtDate(renderedStatus.created_at) ?? '',
    avatar = LAvatar({ img: _status.account.avatar }),
    statusButtons = LStatusButtons({
      status,
      permissions,
      ...statuButtonsHandlers,
    }),
    attachments = !_status.sensitive ? getAttachmentsEl() : undefined,
    dispName = renderedStatus.account.display_name,
    sensitiveButton = LButton({
      className: 'showSensitiveContent',
      text: 'Show sensitive content',
      onClick: onShowSensitiveClick,
    })

  function onShowSensitiveClick() {
    const attachments = getAttachmentsEl()
    _status.content &&
      el.insertBefore(h('div', { innerHTML: _status.content }), sensitiveEl!)
    attachments && el.insertBefore(attachments, sensitiveEl!)
    sensitiveEl!.remove()
  }

  let sensitiveEl = _status.sensitive
    ? div('sensitiveContent', [sensitiveButton.el])
    : undefined

  let avatarLink = h(
    'a',
    {
      attrs: {
        href: `/profile/${_status.account.acct}/`,
      },
      onClick: (e) => {
        e.preventDefault()
        lRouter.navigateTo(`/profile/${_status.account.acct}/`)
      },
    },
    [avatar.el],
  )

  function onStatusClick(e: MouseEvent) {
    let el = (e.composedPath() as HTMLElement[]).find((el) =>
        ['A', 'IMG', 'VIDEO', 'BUTTON'].includes(el.tagName?.toUpperCase()),
      ),
      selection = window.getSelection()?.toString()
    if (!el && !selection) onContentClick?.(_status)
  }

  let statusContent = _status.sensitive
    ? undefined
    : h('div', {
        className: ['content', clickableContent ? 'content--clickable' : ''],
        innerHTML: parseContent(_status),
      })

  let linkToAccount = a(
    'profileLink',
    _status.account?.url,
    _status.account?.acct || '',
  )

  function getAttachmentsEl(): HTMLElement | undefined {
    let mediaCnt = _status.media_attachments.length,
      contClass = mediaCnt > 1 ? 'attachment2Col' : 'attachment',
      result = mediaCnt > 0 ? div(contClass) : undefined

    result &&
      _status.media_attachments.forEach((attachment) => {
        const node = attachmentNode(attachment)
        node && result.appendChild(node)
      })

    return result
  }

  function attachmentNode(
    attachment: MediaAttachment,
  ): HTMLElement | undefined {
    if (attachment.type === 'image')
      return h(
        'a',
        {
          attrs: {
            href: attachment.url,
            target: '_blank',
          },
          className: 'linkAttachment',
        },
        [
          h('img', {
            className: 'imageAttachment',
            attrs: {
              src: attachment.preview_url ?? attachment.url,
              alt: attachment.description ?? '',
              loading: 'lazy',
            },
          }),
        ],
      )

    if (['gifv', 'video'].includes(attachment.type))
      return h('video', {
        className: 'videoAttachment',
        attrs: {
          src: attachment.url,
          controls: '',
        },
      })
    else return undefined
  }

  let el = h(
    'div',
    {
      className: ['status', singleView ? 'single' : ''],
      attrs: {
        tabIndex: '0',
      },
      onClick: onStatusClick,
      onKeypress: (e) => {
        if (e.key === 'Enter') onContentClick?.(_status)
      },
    },
    [
      isReblogged
        ? div('boostedText', [span('', `${dispName} boosted: `)])
        : undefined,
      div('header', [
        avatarLink,
        div('profileInfo', [
          span('profileName', `${_status.account?.display_name || ''}`),
          linkToAccount,
        ]),
        span('createDate', `${createDate}`),
      ]),
      statusContent,
      _status.sensitive ? sensitiveEl : attachments,
      statusButtons.el,
    ],
  )

  return {
    el,
  }
}

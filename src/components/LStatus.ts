import type { Status, MediaAttachment, StatusEventHandlers } from '../types/shared'
import { h, a, div, span } from '../utils/dom'
import { fmtDate } from '../utils/dates'
import { lRouter } from '../router'
import { LAvatar } from './Avatar'
import { LStatusButtons } from './LStatusButtons'
import type { ActionPermissions } from './LStatusButtons'
import { parseContent } from '../utils/shared'
import { LButton } from './LButton'

type StatusProps = {
  status: Status,
  permissions?: ActionPermissions,
  clickableContent?: boolean
  singleView?: boolean
} & StatusEventHandlers

export function LStatus(opts: StatusProps) {
  const {
    status,
    permissions = { canDelete: false, canBoost: false },
    clickableContent = true,
    singleView = false,
    onContentClick = () => {},
    ...statuButtonsHandlers
  } = opts

  let _status = status.reblog ?? status,
  isReblogged = Boolean(status.reblog),
  renderedStatus = status,
  createDate = fmtDate(renderedStatus.created_at) ?? '',
  avatar = LAvatar({img: _status.account.avatar}),
  statusButtons = LStatusButtons({status, permissions, ...statuButtonsHandlers}),
  attachments = !_status.sensitive ? getAttachmentsEl() : undefined,
  dispName = renderedStatus.account.display_name,
  sensitiveButton = LButton({className: 'status-showSensitiveContent', text: 'Show sensitive content', onClick: () => onShowSensitiveClick()})

  function onShowSensitiveClick()  {
    sensitiveEl?.remove()
    const attachments = getAttachmentsEl()
    _status.content && el.appendChild(h('div', { innerHTML: _status.content }))
    attachments && el.appendChild(attachments)
  }

  let sensitiveEl = _status.sensitive
    ? div('status-sensitiveContent', [sensitiveButton.el])
    : undefined

  let avatarLink = h('a', {
    attrs: {
      href: `/profile/${_status.account.acct}/`
    },
    onClick: (e) => {
      e.preventDefault()
      lRouter.navigateTo(`/profile/${_status.account.acct}/`)
    }
  }, [avatar.el])

  let statusContent = _status.sensitive
    ? undefined
    : h('div', {
      className: ['status-content', clickableContent ? 'status-content--clickable': ''],
      innerHTML: parseContent(_status.content),
      onClick: (e) => {
        if (e.target instanceof HTMLParagraphElement) {
          // Don't redirect to the single status view if some text is selected -
          // we only redirect on click
          let selection = window.getSelection()
          if (selection?.type !== 'Range')
            onContentClick?.(_status)
        }
      }
    })

  let linkToAccount = a(
    'status-profileLink',
    _status.account?.url,
    _status.account?.acct || ''
  )

  function getAttachmentsEl(): HTMLElement | undefined {
    let mediaCnt = _status.media_attachments.length,
    
    contClass = mediaCnt > 1
      ? 'status-attachment2Col'
      : 'status-attachment',

    result = mediaCnt > 0
      ? div(contClass)
      : undefined

    result && _status.media_attachments.forEach(attachment => {
      const node = attachmentNode(attachment)
      node && result.appendChild(node)
    })

    return result

  }

  function attachmentNode(attachment: MediaAttachment): HTMLElement | undefined {
    if (attachment.type === 'image')
      return h('a', {
        attrs: {
          href: attachment.url,
          target: '_blank'
        },
        className: 'status-linkAttachment'
      },
        [
          h('img', {
            className: 'status-imageAttachment',
            attrs: { src: attachment.preview_url ?? attachment.url, alt: attachment.description ?? ''}
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


  const el = div(['status', singleView ? 'status--isSingle' : ''], [
    isReblogged
      ? div( 'status-boostedText', [span('', `${dispName} boosted: `)])
      : undefined,
    div('status-header', [
      avatarLink,
      div('status-profileInfo', [
        span('status-profileName', `${_status.account?.display_name || ''}`),
        linkToAccount,
      ]),
      span('status-createDate', `${createDate}`),
    ]),
    statusContent,
    _status.sensitive
      ? sensitiveEl
      : attachments,
    statusButtons.el,
  ])

  return {
    el,
  }

}


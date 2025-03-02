import { getIcon, h } from '../utils/dom'
import type { Status, StatusEventHandlers } from '../types/shared.d.ts'

export interface ActionPermissions {
  canBoost?: Boolean
  canDelete?: boolean
}

type StatusButtonsProps = {
  status: Status
  permissions: ActionPermissions
} & StatusEventHandlers

const BOOSTED_CLASS = 'status-button-isBoosted'

export function LStatusButtons(props: StatusButtonsProps) {
  let status = props.status.reblog ?? props.status

  let boostBtn: HTMLButtonElement | undefined,
    deleteBtn: HTMLButtonElement | undefined

  function createBoostBtn() {
    let className: string[] = ['icon-button', 'status-button'],
      title = 'Boost'
    if (status.reblogged) {
      className.push('status-button-isBoosted')
      title = 'Unboost'
    }

    console.log('title=', title)

    return h('button', {
      className,
      innerHTML: getIcon('icon-boost'),
      onClick: onBoostClick,
      attrs: {
        title,
      },
    })
  }

  function createDeleteBtn() {
    return h('button', {
      className: ['icon-button', 'status-button', 'ml-auto'],
      innerHTML: getIcon('icon-delete'),
      onClick: onDeleteClick,
    })
  }

  let { canBoost, canDelete } = props.permissions
  canBoost && (boostBtn = createBoostBtn())
  canDelete && (deleteBtn = createDeleteBtn())

  const el = h(
    'div',
    {
      className: 'status-buttons',
    },
    [boostBtn, deleteBtn],
  )

  function onBoostClick() {
    if (props.onBoost) {
      props.onBoost(status, !status.reblogged)
    }

    // Toggle boosted class
    if (!status.reblogged) boostBtn?.classList.add(BOOSTED_CLASS)
    else boostBtn?.classList.remove(BOOSTED_CLASS)

    status.reblogged !== undefined && (status.reblogged = !status.reblogged)
  }

  function onDeleteClick() {
    props.onDelete && props.onDelete(status)
  }

  return {
    el,
  }
}

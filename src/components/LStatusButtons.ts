import { h } from '../utils/dom'
import type { Status, StatusEventHandlers } from '../types/shared.d.ts'
import { boost, deleteIcon } from './Icons.ts'

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
  const status = props.status.reblog ?? props.status

  let boostBtn: HTMLButtonElement | undefined
  let deleteBtn: HTMLButtonElement | undefined

  function createBoostBtn() {
    const className: string[] = ['icon-button', 'status-button']
    if (status.reblogged)
      className.push('status-button-isBoosted')

    return h('button', {className, innerHTML: boost, onClick: onBoostClick})
  }

  function createDeleteBtn() {
    return h('button', {className: ['icon-button', 'status-button', 'ml-auto'], innerHTML: deleteIcon, onClick: onDeleteClick})
  }

  props.permissions.canBoost && (boostBtn = createBoostBtn())
  props.permissions.canDelete && (deleteBtn = createDeleteBtn())

  const el = h('div', {
    className: 'status-buttons' },
    [
      boostBtn,
      deleteBtn,
    ]
  )

  function onBoostClick() {
      if (props.onBoost) {
        props.onBoost(status, !status.reblogged)
      }

      // Toggle boosted class
      if (!status.reblogged)
        boostBtn?.classList.add(BOOSTED_CLASS)
      else
        boostBtn?.classList.remove(BOOSTED_CLASS)

      status.reblogged !== undefined && (status.reblogged = !status.reblogged)
  }

  function onDeleteClick() {
    props.onDelete && props.onDelete(status)
  }

  return {
    el,
  }
}
import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { div, ElLike } from '../utils/dom'
import {
  boostStatus,
  deleteStatus,
  getPermissions,
  navigateToStatus,
  unboostStatus,
} from '../core/status.ts'

type StatusesListProps = {
  root: HTMLElement
  statuses: Status[]
}

export function LStatusesList(props: StatusesListProps) {
  let el = div('statusesList')

  addStatuses(props.statuses)

  props.root.appendChild(el)

  let onDelete = (statusComponent: ElLike, s: Status) => {
    statusComponent.el.remove()
    deleteStatus(s.id)
  }

  let onBoost = (s: Status, boosted: boolean) => {
    if (boosted) boostStatus(s.id)
    else unboostStatus(s.id)
  }

  let onContentClick = (s: Status) => navigateToStatus(s),
    clearStatuses = () => (el.innerHTML = '')

  function addStatuses(statuses: Status[]) {
    let fragment = document.createDocumentFragment()
    for (let status of statuses) {
      let permissions = getPermissions(status)

      let statusComp = LStatus({
        status,
        permissions,
        onBoost: onBoost,
        onDelete: (s) => onDelete(statusComp, s),
        onContentClick: onContentClick,
      })

      fragment.append(statusComp.el)
    }

    el.appendChild(fragment)
  }

  return {
    addStatuses,
    clearStatuses,
  }
}

import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { div, ElLike } from '../utils/dom'
import { StatusManager } from '../appManager.ts'

type StatusesListProps = {
  root: HTMLElement
  statuses: Status[]
  sm: StatusManager
}

export function LStatusesList(props: StatusesListProps) {
  let el = div('statusesList')

  addStatuses(props.statuses)

  props.root.appendChild(el)

  let onDelete = (statusComponent: ElLike, s: Status) => {
    statusComponent.el.remove()
    props.sm.deleteStatus(s.id)
  }

  let onBoost = (s: Status, boosted: boolean) => {
    if (boosted) props.sm.boostStatus(s.id)
    else props.sm.unboostStatus(s.id)
  }

  let onContentClick = (s: Status) => props.sm.navigateToStatus(s),
    clearStatuses = () => (el.innerHTML = '')

  function addStatuses(statuses: Status[]) {
    let fragment = document.createDocumentFragment()
    for (let status of statuses) {
      let own = props.sm.ownStatus(status.reblog ?? status),
        perm = props.sm.getPermissions(),
        permissions = {
          canBoost: perm.canBoost && !own,
          canDelete: perm.canDelete && own,
        }

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

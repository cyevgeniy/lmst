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

  props.root.appendChild(el)

  function onDelete(statusComponent: ElLike, s: Status) {
    statusComponent.el.remove()
    props.sm.deleteStatus(s.id)
  }

  function onBoost(s: Status, boosted: boolean) {
    if (boosted)
      props.sm.boostStatus(s.id)
    else
      props.sm.unboostStatus(s.id)  
  }

  function onContentClick(s: Status) {
    props.sm.navigateToStatus(s)  
  }

  function clearStatuses() {
    el.innerHTML = ''
  }

  function addStatuses(statuses: Status[]) {
    for (const status of statuses) {
      let own = props.sm.ownStatus(status.reblog ?? status),
      perm = props.sm.getPermissions(),
      permissions = { canBoost: perm.canBoost && !own, canDelete: perm.canDelete && own }

      const statusComp = LStatus({
        status,
        permissions, 
        onBoost: (s, b) => onBoost(s, b),
        onDelete: (s) => onDelete(statusComp, s),
        onContentClick: (s) => onContentClick(s),
      })

      statusComp.el.classList.add('status--withBorder')
      el?.appendChild(statusComp.el)
    }
  }

  return {
    addStatuses,
    clearStatuses,
  }
}


import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { div, ElLike } from '../utils/dom'
import { StatusManager } from '../appManager.ts'

interface StatusesListConstructorParams {
  root: HTMLElement
  statuses: Status[]
  sm: StatusManager
}

export class LStatusesList {
  private el: HTMLElement
  private sm: StatusManager

  constructor(opts: StatusesListConstructorParams) {
    this.sm = opts.sm
    this.el = div('statusesList')

    this.addStatuses(opts.statuses)

    opts.root.appendChild(this.el)
  }

  addStatuses(statuses: Status[]) {
    for (const status of statuses) {
      const own = this.sm.ownStatus(status.reblog ?? status)
      const perm = this.sm.getPermissions()
      const permissions = { canBoost: perm.canBoost && !own, canDelete: perm.canDelete && own }

      const statusComp = LStatus({
        status,
        permissions, 
        onBoost: (s, b) => this.onBoost(s, b),
        onDelete: (s) => this.onDelete(statusComp, s),
        onContentClick: (s) => this.onContentClick(s),
      })

      statusComp.el.classList.add('status--withBorder')
      this.el?.appendChild(statusComp.el)
    }
  }

  private onDelete(statusComponent: ElLike, s: Status) {
    statusComponent.el.remove()
    this.sm.deleteStatus(s.id)
  }

  private onBoost(s: Status, boosted: boolean) {
    if (boosted)
      this.sm.boostStatus(s.id)
    else
      this.sm.unboostStatus(s.id)  
  }

  private onContentClick(s: Status) {
    this.sm.navigateToStatus(s)  
  }

  clearStatuses() {
    this.el.innerHTML = ''
  }
}

import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { div } from '../utils/dom'
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

      const statusComp = LStatus({status, permissions})
      statusComp.onBoost((s, boosted) => {
        if (boosted)
          this.sm.boostStatus(s.id)
        else
          this.sm.unboostStatus(s.id)
      })

      statusComp.onDelete((s) => {
        statusComp.el.remove()
        this.sm.deleteStatus(s.id)

      })

      statusComp.onContentClick((s) => {
        this.sm.navigateToStatus(s)
      })
      statusComp.el.classList.add('status--withBorder')
      this.el?.appendChild(statusComp.el)
    }
  }

  clearStatuses() {
    this.el.innerHTML = ''
  }
}

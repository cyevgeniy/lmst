import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { h } from '../utils/dom'
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
    this.el = h('div', {class: 'statuses-list'})

    this.addStatuses(opts.statuses)

    opts.root.appendChild(this.el)
  }

  addStatuses(statuses: Status[]) {
    for (const status of statuses) {
      const actionsEnabled = this.sm.actionsEnabled() && !this.sm.ownStatus(status.reblog ?? status)
      console.log(this.sm.ownStatus(status.reblog ?? status))

      const statusComp = new LStatus({status, actionsEnabled})
      statusComp.onBoost((s, boosted) => {
        if (boosted)
          this.sm.boostStatus(s.id)
        else
          this.sm.unboostStatus(s.id)
      })
      statusComp.el.classList.add('statuses-list__status')
      this.el?.appendChild(statusComp.el)
    }
  }

  clearStatuses() {
    this.el.innerHTML = ''
  }
}

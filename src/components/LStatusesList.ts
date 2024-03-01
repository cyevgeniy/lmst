import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { h } from '../utils/dom'

export class LStatusesList {
  private el: HTMLElement

  constructor(root: HTMLElement, statuses: Status[]) {
    this.el = h('div', {class: 'statuses-list'})

    this.addStatuses(statuses)

    root.appendChild(this.el)
  }

  addStatuses(statuses: Status[]) {
    for (const status of statuses) {
      const statusComp = new LStatus(status)
      statusComp.onBoost((s) => {
        alert(`boost status with id = ${s.id}`)
      })
      statusComp.el.classList.add('statuses-list__status')
      this.el?.appendChild(statusComp.el)
    }
  }

  clearStatuses() {
    this.el.innerHTML = ''
  }
}

import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { h } from '../utils/dom'

export interface StatusesListComponent {
  /**
   * Adds list of statuses
   */
  addStatuses: (statuses: Status[]) => void

  mount: () => void
}

export function LStatusesList(root: HTMLElement, statuses: Status[]): StatusesListComponent {
  let rendered = false
  let el: HTMLElement

  function addStatuses(statuses: Status[]) {
    for (const status of statuses) {
      const statusEl = LStatus(status).mount()
      statusEl.classList.add('statuses-list__status')
      el?.appendChild(statusEl)
    }
  }

  function render() {
    el = h('div', {class: 'statuses-list'})

    addStatuses(statuses)

    root.appendChild(el)
  }

  function mount() {
    if (!rendered) {
      render()
      rendered = true
    }

    return el
  }

  return {
    mount,
    addStatuses,
  }
}

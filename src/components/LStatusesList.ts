import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { h } from '../utils/dom'

export function LStatusesList(statuses: Status[]) {
  let rendered = false
  let el: HTMLElement

  function appendStatuses(statuses: Status[]) {
    for (const status of statuses) {
      const statusEl = LStatus(status).mount()
      statusEl.classList.add('statuses-list__status')
      el?.appendChild(statusEl)
    }
  }

  function render() {
    el = h('div', {class: 'statuses-list'})

    appendStatuses(statuses)
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
    appendStatuses,
  }
}

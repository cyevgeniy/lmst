import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'
import { h } from '../utils/dom'

export function LStatuesList() {
  const el = h('div', {class: 'statuses-list'})

  function add(statuses: Status[]) {
    console.log(statuses)
    for (const status of statuses) {
      const { el: statusEl } = LStatus(status)
      statusEl.classList.add('statuses-list__status')
      el?.appendChild(statusEl)
    }
  }

  return {
    el,
    add,
  }
}

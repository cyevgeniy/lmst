import type { Status } from '../types/shared.d.ts'
import { LStatus } from './LStatus'

export function LStatuesList(statuses: Status[]) {
  const el = document.createElement('div')
  el.classList.add('statuses-list')

  for (const status of statuses) {
    const { el: statusEl } = LStatus(status)
    statusEl.classList.add('statuses-list__status')
    el?.appendChild(statusEl)
  }

  return {
    el
  }
}

import { h } from '../utils/dom'
import type { Account } from '../types/shared'

export interface ProfileHeaderComponent {
  mount: () => void
  update: (a: Account) => void
}

export function LProfileHeader(root: HTMLElement, account?: Account): ProfileHeaderComponent {
  let el: HTMLElement
  let displayNameEl: HTMLElement
  let noteEl: HTMLElement
  let rendered: boolean = false

  function mount() {
    if (rendered)
      return

    displayNameEl = h('div', {class: "account__name"})
    noteEl = h('div', {class: "account__note"})

    el = h('div', {class: "account"}, [displayNameEl, noteEl])
    rendered = true
    root.appendChild(el)
    update(account)
  }

  function update(account?: Account) {
    if (!rendered)
      return

    displayNameEl.innerText = account?.display_name ?? ''
    noteEl.innerHTML = account?.note ?? ''
  }

  return {
    mount,
    update
  }
}

import { div } from '../utils/dom'
import type { Account } from '../types/shared'
import { Avatar } from './Avatar'

export interface ProfileHeaderComponent {
  mount: () => void
  update: (a: Account) => void
}

export function LProfileHeader(root: HTMLElement, account?: Account): ProfileHeaderComponent {
  let el: HTMLElement
  let displayNameEl: HTMLElement
  let noteEl: HTMLElement
  let avatarEl: HTMLElement
  let rendered: boolean = false
  let avatarComp: ReturnType<typeof Avatar>

  function mount() {
    if (rendered)
      return

    displayNameEl = div('account__name')
    noteEl = div('account__note')

    avatarComp = Avatar()
    avatarEl = avatarComp.mount()
    el = div('account', [
      div('account__userinfo', [
        avatarEl,
        displayNameEl
      ]),
      noteEl
    ])

    rendered = true
    root.appendChild(el)
    update(account)
  }

  /**
   * Updates information about the account
   */
  function update(account?: Account) {
    if (!rendered)
      return

    displayNameEl.innerText = account?.display_name ?? ''
    noteEl.innerHTML = account?.note ?? ''
    avatarComp.update(account?.avatar)
  }

  return {
    mount,
    update
  }
}

import { div } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'

export interface ProfileHeaderComponent {
  mount: () => void
  update: (a: Account) => void
}

export function LProfileHeader(root: HTMLElement, account?: Account): ProfileHeaderComponent {
  let el: HTMLElement
  let displayNameEl: HTMLElement
  let noteEl: HTMLElement
  let avatar: LAvatar
  let rendered: boolean = false

  function mount() {
    if (rendered)
      return

    displayNameEl = div('account__name')
    noteEl = div('account__note')

    avatar = new LAvatar()
    // avatarEl = avatarComp.mount()
    el = div('account', [
      div('account__userinfo', [
        avatar.el,
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
    avatar.updateImage(account?.avatar)
  }

  return {
    mount,
    update
  }
}

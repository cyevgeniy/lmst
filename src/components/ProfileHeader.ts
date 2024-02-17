import { div } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'

export class LProfileHeader {
  private el: HTMLElement
  private displayNameEl: HTMLElement
  private noteEl: HTMLElement
  private avatar: LAvatar

  constructor(root: HTMLElement, account?: Account) {
    this.displayNameEl = div('account__name')
    this.noteEl = div('account__note')

    this.avatar = new LAvatar()
    // avatarEl = avatarComp.mount()
    this.el = div('account', [
      div('account__userinfo', [
        this.avatar.el,
        this.displayNameEl
      ]),
      this.noteEl
    ])

    root.appendChild(this.el)
    this.update(account)  
  }

  /**
   * Updates information about the account
   */
  update(account?: Account) {
    this.displayNameEl.innerText = account?.display_name ?? ''
    this.noteEl.innerHTML = account?.note ?? ''
    this.avatar.updateImage(account?.avatar)
  }
}

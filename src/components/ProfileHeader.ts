import { div } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'
import { parseContent } from '../utils/shared'

export class LProfileHeader {
  private el: HTMLElement
  private displayNameEl: HTMLElement
  private noteEl: HTMLElement
  private avatar: ReturnType<typeof LAvatar>

  constructor(root: HTMLElement, account?: Account) {
    this.displayNameEl = div('profileHeader-name')
    this.noteEl = div('profileHeader-note')

    this.avatar = LAvatar({img: '', size: 'lg'})
    this.el = div('profileHeader', [
      div('profileHeader-userInfo', [
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
    const parsedContent = parseContent(account?.note ?? '')
    this.noteEl.innerHTML = parsedContent
    this.avatar.img = account?.avatar ?? ''
  }
}

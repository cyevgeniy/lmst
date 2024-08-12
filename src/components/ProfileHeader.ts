import { div } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'
import { parseContent } from '../utils/shared'

export function LProfileHeader(account?: Account) {
  const displayNameEl = div('profileHeader-name')
  const noteEl = div('profileHeader-note')

  const avatar = LAvatar({img: '', size: 'lg'})
  const el = div('profileHeader', [
    div('profileHeader-userInfo', [
      avatar.el,
      displayNameEl
    ]),
    noteEl
  ])

  update(account)

  /**
   * Updates information about the account
   */
  function update(account?: Account) {
    displayNameEl.innerText = account?.display_name ?? ''
    const parsedContent = parseContent(account?.note ?? '')
    noteEl.innerHTML = parsedContent
    avatar.img = account?.avatar ?? ''
  }

  return {
    el,
    update,
  }
}

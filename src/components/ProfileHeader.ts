import { div, useCommonEl } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'
import { LButton } from './LButton'
import { on } from '../utils/signal'
import { useProfileRelation } from '../utils/useProfileRelation'
import { user } from '../utils/user'

export function LProfileHeader(account?: Account) {
  let displayNameEl = div('profileHeader-name'),
  noteEl = div('profileHeader-note'),
  actionsEl = div('profileHeader-actions'),
  id: Account['id']
  
  let {
    updateRelation,
    loading,
    relation,
    followunfollow,
  } = useProfileRelation()


  // let { followunfollow } = useProfileRelation(id)
  // followunfollow

  let avatar = LAvatar({img: '', size: 'lg'}),
  follow = LButton({text: '', onClick: () => followunfollow(id)})
  
  actionsEl.appendChild(follow.el)
  const { show, hide } = useCommonEl(follow.el)
  hide()

  on(relation, (newVal) => {
    if (newVal) {
      follow.text = newVal.following ? 'Unfollow' : 'Follow'
      show()
    } else {
      hide()
    }
  })

  on(loading, (newVal) => {
    follow.disabled = newVal
    if (newVal)
      follow.text = 'loading...'
  })

  const el = div('profileHeader', [
    div('profileHeader-userInfo', [
      avatar.el,
      displayNameEl,
    ]),
    noteEl,
    actionsEl,
  ])

  update(account)

  /**
   * Updates information about the account
   */
  async function update(account?: Account) {
    displayNameEl.innerText = account?.display_name ?? ''
    const parsedContent = account?.note ?? ''
    noteEl.innerHTML = parsedContent
    avatar.img = account?.avatar ?? ''

    // Don't show 'follow'/'unfollow' on your own profile
    if (account && user.user().id !== account.id && user.isLoaded()) {
      updateRelation(id = account.id)
    }
  }

  return {
    el,
    update,
  }
}

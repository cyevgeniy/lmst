import { div, useCommonEl } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'
import { LButton } from './LButton'
import { on } from '../utils/signal'
import { useProfileRelation } from '../utils/useProfileRelation'
import { user } from '../utils/user'

function openOriginalSite(url: string): void {
  url && window.open(`${url}`, '_blank')
}

export function LProfileHeader(account?: Account) {
  let displayNameEl = div('ph-name'),
    noteEl = div('ph-note'),
    actionsEl = div('ph-actions'),
    id: Account['id'],
    url: Account['url']

  let { updateRelation, loading, relation, followunfollow } =
    useProfileRelation()

  // let { followunfollow } = useProfileRelation(id)
  // followunfollow

  let avatar = LAvatar({ img: '', size: 'lg' }),
    follow = LButton({ text: '', onClick: () => followunfollow(id) }),
    originalSite = LButton({
      text: 'Open in original site',
      onClick: () => openOriginalSite(url),
    })

  actionsEl.appendChild(follow.el)
  actionsEl.appendChild(originalSite.el)
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
    if (newVal) follow.text = 'loading...'
  })

  const el = div('ph', [
    div('ph-userInfo', [avatar.el, displayNameEl]),
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
    url = account?.url ?? ''

    // Hide 'open in original site' button if account url is empty
    if (!url) hide(openOriginalSite.el)

    // Don't show 'follow'/'unfollow' on your own profile
    if (account && user.user().id !== account.id && user.isLoaded()) {
      updateRelation((id = account.id))
    }
  }

  return {
    el,
    update,
  }
}

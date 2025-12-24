import { childs, div, h, useCommonEl } from '../utils/dom'
import type { Account } from '../types/shared'
import { LAvatar } from './Avatar'
import { LButton } from './LButton'
import { on } from '../utils/signal'
import { useProfileRelation } from '../utils/useProfileRelation'
import { user, isLoaded } from '../core/user'

function openOriginalSite(url: string): void {
  url && window.open(`${url}`, '_blank')
}

export function LProfileHeader(account?: Account) {
  let displayNameEl = div('phName'),
    noteEl = div('phNote'),
    fieldsEl = div('phFields'),
    actionsEl = div('phActions'),
    id: Account['id'],
    url: Account['url']

  let { updateRelation, loading, relation, followunfollow } =
    useProfileRelation()

  let avatar = LAvatar({ img: '', size: 'lg' }),
    follow = LButton({ text: '', onClick: () => followunfollow(id) }),
    originalSite = LButton({
      text: 'Open in original site',
      onClick: () => openOriginalSite(url),
    })

  let { show: showOriginalSite, hide: hideOriginalSite } = useCommonEl(
    originalSite.el,
  )

  childs(actionsEl, [follow, originalSite])
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
    div('phUserInfo', [avatar.el, displayNameEl]),
    noteEl,
    fieldsEl,
    actionsEl,
  ])

  update(account)

  /**
   * Updates information about the account
   */
  async function update(account?: Account) {
    displayNameEl.innerText = account?.display_name ?? ''
    noteEl.innerHTML = account?.note ?? ''
    avatar.img = account?.avatar ?? ''
    url = account?.url ?? ''

    account?.fields.forEach((field) => {
      childs(fieldsEl, [
        div('phFieldItem', [
          h('div', {
            className: ['name', field.verified_at ? 'verified' : ''],
            innerHTML: field.name,
          }),
          h('div', { className: 'value', innerHTML: field.value }),
        ]),
      ])
    })

    // Hide 'open in original site' button if account url is empty
    if (!url) hideOriginalSite()
    else showOriginalSite()

    // Don't show 'follow'/'unfollow' on your own profile
    if (account && user().id !== account.id && isLoaded()) {
      updateRelation((id = account.id))
    }
  }

  return {
    el,
    update,
  }
}

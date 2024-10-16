import { lRouter } from '../router'
import { Account } from '../types/shared'
import { h } from '../utils/dom'
import { LAvatar } from './Avatar'

export function LAvatarLink(acct: Account) {
  const avatar = LAvatar({img: acct.avatar})

  const avatarLink = h('a', {
    attrs: {
      href: `/profile/${acct.acct}/`
    },
    onClick: (e) => {
      e.preventDefault()
      lRouter.navigateTo(`/profile/${acct.acct}/`)
    }
  }, [avatar.el])

  return {
    el: avatarLink,
  }


}
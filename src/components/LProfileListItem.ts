import { Account } from '../types/shared'
import { div, span } from '../utils/dom'
import { LAvatar } from './Avatar'

export function LProfileListInfo(acct: Account, ) {
    let avatar = LAvatar({img: acct.avatar})
    const linkToAccount = span(
        'profileItem-link',
        acct.acct || ''
      )
    
    let el = div('profileItem', [
        avatar.el,
        div('', [
            span('profileItem-name', acct.display_name),
            linkToAccount,
        ])
    ])

    return {
        el
    }
}
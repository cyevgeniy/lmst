import { Account } from '../types/shared'
import { div, h, HTMLEventHandler, span } from '../utils/dom'
import { LAvatar } from './Avatar'

export function LProfileListInfo(acct: Account, opts: HTMLEventHandler = {} ) {
    let avatar = LAvatar({img: acct.avatar}),
    
    linkToAccount = span(
        'profileItem-link',
        acct.acct || ''
      )
    
    let el = h('div', {className: 'profileItem', ...opts}, [
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
import {h, div, show, hide } from '../utils/dom'
import { CredentialAccount, User } from '../utils/user'
import { lRouter } from '../router'
import type { Mediator } from '../types/shared'
import { onClick } from '../utils/events'
import { LNavLink } from './LNavLink'
import { globe, pen } from './Icons'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLDivElement
  /**
   * Link to the user profile
   */
  private profileLink: LNavLink
  private logoutLink: LNavLink
  private composeLink: LNavLink
  private signupContainer: HTMLElement
  private mainLink: LNavLink
  private pageMediator: Mediator

  private user: User

  constructor(root: HTMLElement, pm: Mediator) {
    this.pageMediator = pm
    this.user = new User()
    this.profileLink = new LNavLink({text: '', link: '/'}) //h('a', {attrs: { href: '/' } })
    this.authorize = h('div', {className: 'navBar-link' } , 'Login')
    this.logoutLink = new LNavLink({text: 'Logout', link: '#'}) //h('a', {attrs: { href: '#' }}  , 'Logout')
    this.composeLink = new LNavLink({text: 'Compose', link: '/compose', icon: pen})
    this.mainLink = new LNavLink({text: 'Lmst', link: '/', icon: globe})
    this.signupContainer = h('div', {
      className: 'navBar-rightItems'
    },[
      this.profileLink.el,
      this.authorize,
      this.logoutLink.el,
    ])

    // this.mainLink = h('a', {attrs: {href: '/'}}, [
    //     h('span', {attrs: {id: 'logo'}}, 'Lmst')
    //   ])
    this.el = div('navBar', [
      this.mainLink.el,
      this.composeLink.el,
      this.signupContainer,
    ])

    root.appendChild(this.el)

    this.user.addOnUserChangeCb((u: CredentialAccount) => {
      if (u.id) {
        hide(this.authorize)
        this.profileLink.setText(u.display_name)
        this.profileLink.setLink(`/profile/${u.acct}/`)
        this.profileLink.show()
      }
      else {
        this.profileLink.setLink('/')
        this.profileLink.setText('')
        show(this.authorize)
        this.profileLink.hide()
      }
    })

    this.user.addOnUserChangeCb(u => {
      this.composeLink.el.style.display = u.isLoaded() ? 'inline-flex' : 'none'

      this.updLogoutVisibility()
    });

    this.user.verifyCredentials()

    onClick(this.mainLink.el, (e: MouseEvent) => {
      e.preventDefault()
      this.pageMediator.notify('navigate:main')
    })

    onClick(this.authorize, async () => {
      this.pageMediator.notify('navigate:login')
    })

    onClick(this.logoutLink.el, (e: MouseEvent) => {
      e.preventDefault()
      this.pageMediator.notify('navigate:logout')
    })

    onClick(this.composeLink.el, (e: MouseEvent) => {
      e.preventDefault()
      lRouter.navigateTo('/compose')
    })
  }

  private updLogoutVisibility() {
      if (!this.user.isLoaded())
        this.logoutLink.hide()
      else
        this.logoutLink.show()
  }
}

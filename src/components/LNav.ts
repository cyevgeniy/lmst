import {h, div, show, hide } from '../utils/dom'
import { CredentialAccount, User } from '../utils/user'
import { lRouter } from '../router'
import type { Mediator } from '../types/shared'
import { onClick } from '../utils/events'
import { LNavLink } from './LNavLink'
import penIcon from '../../assets/icons/pen.svg?raw'
import globeIcon from '../../assets/icons/globe.svg?raw'
import { globe } from './Icons'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLDivElement
  /**
   * Link to the user profile
   */
  private profileLink: HTMLAnchorElement
  private logout: HTMLAnchorElement
  private composeLink: LNavLink
  private signupContainer: HTMLElement
  private mainLink: LNavLink
  private pageMediator: Mediator

  private user: User

  constructor(root: HTMLElement, pm: Mediator) {
    this.pageMediator = pm
    this.user = new User()
    this.profileLink = h('a', {attrs: { href: '/' } })
    this.authorize = h('div', {class: 'nav__login' } , 'Login')
    this.logout = h('a', {attrs: { href: '#' }}  , 'Logout')
    this.composeLink = new LNavLink({text: 'Compose', link: '/compose', icon: penIcon})
    this.mainLink = new LNavLink({text: 'Lmst', link: '/', icon: globe})
    this.signupContainer = h('div', {
      class: 'nav--signup-container'
    },[
      this.profileLink,
      this.authorize,
      this.logout,
    ])

    // this.mainLink = h('a', {attrs: {href: '/'}}, [
    //     h('span', {attrs: {id: 'logo'}}, 'Lmst')
    //   ])
    this.el = div('nav', [
      this.mainLink.el,
      this.composeLink.el,
      this.signupContainer,
    ])

    root.appendChild(this.el)

    this.user.addOnUserChangeCb((u: CredentialAccount) => {
      if (u.id) {
        hide(this.authorize)
        this.profileLink.innerText = u.display_name
        this.profileLink.href = `/profile/${u.acct}/`
        show(this.profileLink)
      }
      else {
        this.profileLink.href = '/'
        this.profileLink.innerText = ''
        show(this.authorize)
        hide(this.profileLink)
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

    onClick(this.logout, (e: MouseEvent) => {
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
        hide(this.logout)
      else
        show(this.logout)
  }
}

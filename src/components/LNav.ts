import {h, div } from '../utils/dom'
import { CredentialAccount, User } from '../utils/user'
import { lRouter } from '../router'
import type { Mediator } from '../types/shared'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLElement
  private logout: HTMLElement
  private compose: HTMLAnchorElement
  private signupContainer: HTMLElement
  private mainLink: HTMLElement
  private pageMediator: Mediator

  private user: User

  constructor(root: HTMLElement, pm: Mediator) {
    this.pageMediator = pm
    this.user = new User()

    this.authorize = h('div', {class: 'nav__login' } , 'Login')
    this.logout = h('div', {class: 'nav__logout' } , 'Logout')
    this.compose = h('a', {class: 'nav__compose', attrs: { href: '/compose'}}, 'Compose')
    this.signupContainer = h('div',
      {class: 'nav--signup-container'},
      [
        this.authorize,
        this.logout,
      ])

    this.mainLink = h('a', {attrs: {href: '/'}}, [
        h('span', {attrs: {id: 'logo'}}, 'Lmst')
      ])
    this.el = div('nav', [
      this.mainLink,
      this.compose,
      this.signupContainer,
    ])

    root.appendChild(this.el)
    this.user.addOnUserChangeCb((u: CredentialAccount) => {
      this.authorize.innerText = u.id ? u.display_name : 'Login'
    })

    this.user.addOnUserChangeCb(u => {
      this.compose.style.display = u.isLoaded() ? 'inline-block' : 'none'
    })

    this.user.verifyCredentials()

    this.mainLink.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      this.pageMediator.notify('navigate:main')
    })

    this.authorize.addEventListener('click', async () => {
      this.pageMediator.notify('navigate:login')
    })

    this.logout.addEventListener('click', () => {
      this.pageMediator.notify('navigate:logout')
    })

    this.compose.addEventListener('click', (e: MouseEvent) => {
      e.preventDefault()
      lRouter.navigateTo('/compose')
    })
  }
}

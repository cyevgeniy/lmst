import {h, div } from '../utils/dom'
import { CredentialAccount, User } from '../utils/user'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLElement
  private logout: HTMLElement
  private signupContainer: HTMLElement
  private user: User

  constructor(root: HTMLElement) {
    this.user = new User()

    this.authorize = h('div', {class: 'nav__login' } , 'Login')
    this.logout = h('div', {class: 'nav__logout' } , 'Logout')
    this.signupContainer = h('div',
      {class: 'nav--signup-container'},
      [
        this.authorize,
        this.logout,
      ])

    this.el = div('nav', [
      h('a', {attrs: {href: '/'}}, [
        h('span', {attrs: {id: 'logo'}}, 'Lmst')
      ]),
      this.signupContainer,
    ])

    root.appendChild(this.el)
    this.user.addOnUserChangeCb((u: CredentialAccount) => {
      this.authorize.innerText = u.id ? u.display_name : 'Login'
    })

    this.user.verifyCredentials()

    this.authorize.addEventListener('click', async () => {
      // First, check if we hava cached user data
      await this.user.verifyCredentials() //user.value = await verifyCredentials()
      if (this.user.isLoaded())
        window.location.replace('/')
      else
        await this.user.authorize()
    })

    this.logout.addEventListener('click', () => {
      this.user.logOut()
      window.location.replace('/')
    })
  }
}

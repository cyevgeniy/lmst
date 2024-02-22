import {h, div } from '../utils/dom'
import { authorize, useUser, verifyCredentials } from '../utils/user'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLElement
  private logout: HTMLElement
  private signupContainer: HTMLElement

  constructor(root: HTMLElement) {
    const user = useUser()

    this.authorize = h('div', null , 'Login')
    this.logout = h('div', null , 'Logout')
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
    verifyCredentials().then(user => {
      if (user)
        this.authorize.innerText = user.display_name
    })

    this.authorize.addEventListener('click', async () => {
      // First, check if we hava cached user data
      user.value = await verifyCredentials()
      if (user.value)
        window.location.replace('/')
      else
        await authorize()
    })
  }
}

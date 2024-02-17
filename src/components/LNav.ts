import {h, div } from '../utils/dom'
import { authorize } from '../utils/user'

export class LNav {
  public el: HTMLElement
  private authorize: HTMLElement
  private logout: HTMLElement
  private signupContainer: HTMLElement

  constructor(root: HTMLElement) {
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

    this.authorize.addEventListener('click', async () => {
      await authorize()
    })
  }
}

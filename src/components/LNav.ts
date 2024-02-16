import {h, div } from '../utils/dom'

export class LNav {
  public el: HTMLElement

  constructor(root: HTMLElement) {
    this.el = div('nav', [
      h('a', {attrs: {href: '/'}}, [
        h('span', {attrs: {id: 'logo'}}, 'Lmst')
      ] )
    ])

    root.appendChild(this.el)  
  }
}
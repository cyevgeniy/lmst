import { h } from '../utils/dom'

export class LNavLink {
  public el: HTMLAnchorElement

  constructor(opts: {
    text: string
    link: string
    icon: string
  }) {
    this.el = h('a', {class: 'nav--link', innerHTML: `${opts.icon}${opts.text}`, attrs: { href: opts.link}},)
  }
}
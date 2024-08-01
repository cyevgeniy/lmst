import { h, hide, show } from '../utils/dom'

export class LNavLink {
  public readonly el: HTMLAnchorElement

  constructor(opts: {
    text: string
    link: string
    icon?: string
  }) {
    this.el = h('a', {
      class: 'navBar-link',
      innerHTML: `${opts.icon ?? ''}${opts.text}`,
      attrs: { href: opts.link}
    })
  }

  public setLink(link: string) {
    this.el.href = link
  }

  public setText(text: string) {
    this.el.innerText = text
  }

  public show() {
    show(this.el)
  }

  public hide() {
    hide(this.el)
  }
}
import { h, hide, HTMLEventHandler, show, useCommonEl } from '../utils/dom'

export type NavLinkProps = {
  text: string
  link: string
  icon?: string
} & HTMLEventHandler

export function LNavLink(props: NavLinkProps) {
  const { text, link, icon, ...handlers} = props
  const el = h('a', {
    className: 'navBar-link',
    innerHTML: `${icon ?? ''}${text}`,
    attrs: { href: link},
    ...handlers,
  })

  const { show, hide, setText } = useCommonEl(el)

  return {
    el,
    setText,
    set link(l: string) {
      el.href = l
    },
    set visible(v: boolean) {
      if (v) show()
      else hide()
    }
  }
}


export class lLNavLink {
  public readonly el: HTMLAnchorElement

  constructor(opts: {
    text: string
    link: string
    icon?: string
  }) {
    this.el = h('a', {
      className: 'navBar-link',
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

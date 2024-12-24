import { h, HTMLEventHandler, useCommonEl } from '../utils/dom'

export type NavLinkProps = {
  text: string
  link: string
  icon?: string
} & HTMLEventHandler

export function LNavLink(props: NavLinkProps) {
  let { text, link, icon, ...handlers} = props
  let el = h('a', {
    className: 'navBar-link',
    innerHTML: `${icon ?? ''}<span>${text}</span>`,
    attrs: { href: link},
    ...handlers,
  })

  let { show, hide, setText } = useCommonEl(el)

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
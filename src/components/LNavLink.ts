import { h, HTMLEventHandler, useCommonEl } from '../utils/dom'

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
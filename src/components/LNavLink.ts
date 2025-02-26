import { h, HTMLEventHandler, useCommonEl } from '../utils/dom'
import { lRouter } from '../router'

export type NavLinkProps = {
  text: string
  link: string
  icon?: string
} & HTMLEventHandler

export function LNavLink(props: NavLinkProps) {
  let {
    text,
    link,
    icon,
    onClick = (e) => {
      e.preventDefault()
      lRouter.navigateTo(link)
    },
    ...handlers
  } = props
  let el = h('a', {
    className: 'navBar-link',
    innerHTML: `${icon ?? ''}<span>${text}</span>`,
    attrs: { href: link },
    onClick,
    ...handlers,
  })

  let { show, hide, setText } = useCommonEl(el)

  return {
    el,
    setText,
    set link(l: string) {
      el.href = link = l
    },
    set visible(v: boolean) {
      if (v) show()
      else hide()
    },
  }
}

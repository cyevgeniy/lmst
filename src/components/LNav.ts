import {h, div, show, hide } from '../utils/dom'
import {  user } from '../utils/user'
import { lRouter } from '../router'
import type { Mediator } from '../types/shared'
import { LNavLink } from './LNavLink'
import { globe, pen } from './Icons'
import { on } from '../utils/signal'

export function LNav(pm: Mediator) {
  user.verifyCredentials()

  const profileLink = LNavLink({text: '', link: '/'}) //h('a', {attrs: { href: '/' } })
  const authorize = h('div', {className: 'navBar-link', onClick: onAuthorizeClick } , 'Login')
  const logoutLink = LNavLink({text: 'Logout', link: '#', onClick: onLogoutClick}) //h('a', {attrs: { href: '#' }}  , 'Logout')
  const composeLink = LNavLink({text: 'Compose', link: '/compose', icon: pen, onClick: onComposeClick})
  const searchLink = LNavLink({text: 'Search', link: '/search', icon: pen, onClick: onSearchClick})
  const mainLink = LNavLink({text: 'Lmst', link: '/', icon: globe, onClick: onMainLinkClick})
  const  signupContainer = h('div', {
    className: 'navBar-rightItems'
  },[
    profileLink.el,
    authorize,
    logoutLink.el,
  ])

  const el = div('navBar', [
    mainLink.el,
    composeLink.el,
    searchLink.el,
    signupContainer,
  ])

  on(user.user, u => {
    if (u.id) {
      hide(authorize)
      profileLink.setText(u.display_name)
      profileLink.link = `/profile/${u.acct}/`
      profileLink.visible = true
    }
    else {
      profileLink.link = '/'
      profileLink.setText('')
      show(authorize)
      profileLink.visible = false
    }

    composeLink.el.style.display = user.isLoaded() ? 'inline-flex' : 'none'

    updLogoutVisibility()
  })

  user.verifyCredentials()

  function onMainLinkClick(e: MouseEvent) {
    e.preventDefault()
    pm.notify('navigate:main')  
  }

  function onAuthorizeClick() {
    pm.notify('navigate:login')
  }

  function onLogoutClick(e: MouseEvent) {
    e.preventDefault()
    pm.notify('navigate:logout')
  }

  function onComposeClick(e: MouseEvent) {
    e.preventDefault()
    lRouter.navigateTo('/compose')
  }

  function onSearchClick(e: MouseEvent) {
    e.preventDefault()
    lRouter.navigateTo('/search')
  }

  function updLogoutVisibility() {
    logoutLink.visible = user.isLoaded()
  }

  return {
    el,
  }

}

import {h, div, show, hide } from '../utils/dom'
import {  user } from '../utils/user'
import { lRouter } from '../router'
import type { GlobalNavigation } from '../types/shared'
import { LNavLink } from './LNavLink'
import { logo, pen, search, logout } from './Icons'
import { on } from '../utils/signal'

export function LNav(gn: GlobalNavigation) {
  user.verifyCredentials()

  let profileLink = LNavLink({text: '', link: '/'}),
  authorize = h('div', {className: 'navBar-link', onClick: onAuthorizeClick } , 'Login'),
  logoutLink = LNavLink({text: 'Logout', link: '#', icon: logout,  onClick: onLogoutClick}),
  composeLink = LNavLink({text: 'Compose', link: '/compose', icon: pen, onClick: onComposeClick}),
  searchLink = LNavLink({text: 'Search', link: '/search', icon: search, onClick: onSearchClick}),

  mainLink = LNavLink({text: 'Lmst', link: '/', icon: logo, onClick: onMainLinkClick}),
  
  signupContainer = h('div', {
    className: 'navBar-rightItems'
  },[
    profileLink.el,
    authorize,
    logoutLink.el,
  ]),

  el = div('navBar', [
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
    gn.goHome()  
  }

  function onAuthorizeClick() {
    gn.login()
  }

  function onLogoutClick(e: MouseEvent) {
    e.preventDefault()
    gn.logout()
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

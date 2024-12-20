import {h, div, show, hide, getIcon } from '../utils/dom'
import {  user } from '../utils/user'
import { lRouter } from '../router'
import type { Account, GlobalNavigation } from '../types/shared'
import { LNavLink } from './LNavLink'
import { on } from '../utils/signal'

export function LNav(gn: GlobalNavigation) {
  let profileLink = LNavLink({text: '', link: '/'}),
  authorize = h('div', {className: 'navBar-link', onClick: onAuthorizeClick } , 'Login'),
  logoutLink = LNavLink({text: 'Logout', link: '#', icon: getIcon('icon-logout'),  onClick: onLogoutClick}),
  composeLink = LNavLink({text: 'Compose', link: '/compose', icon: getIcon('icon-pen'), onClick: onComposeClick}),
  searchLink = LNavLink({text: 'Search', link: '/search', icon: getIcon('icon-search'), onClick: onSearchClick}),
  notificationsLink = LNavLink({text: 'Notifications', link: '/notifications', icon: getIcon('icon-bell'), onClick: onBellClick}),

  mainLink = LNavLink({text: 'Lmst', link: '/', icon: getIcon('icon-logo'), onClick: onMainLinkClick}),

  signupContainer = div('navBar-rightItems', [
    profileLink.el,
    authorize,
    logoutLink.el,
  ]),

  el = div('navBar', [
    mainLink.el,
    composeLink.el,
    searchLink.el,
    notificationsLink.el,
    signupContainer,
  ])

  function setupForUser(u: Account) {
    if (u.id) {
      hide(authorize)
      profileLink.setText(u.display_name || u.acct)
      profileLink.link = `/profile/${u.acct}/`
      profileLink.visible = true
      notificationsLink.visible = true
    }
    else {
      profileLink.link = '/'
      profileLink.setText('')
      show(authorize)
      profileLink.visible = false
      notificationsLink.visible = false
    }

    composeLink.el.style.display = user.isLoaded() ? 'inline-flex' : 'none'

    logoutLink.visible = user.isLoaded()

  }

  setupForUser(user.user())

  on(user.user, u => setupForUser(u))


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

  function onBellClick(e: MouseEvent) {
    e.preventDefault()
    lRouter.navigateTo('/notifications')
  }

  return {
    el,
  }

}

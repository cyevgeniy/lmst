import {h, div, show, hide } from '../utils/dom'
import { CredentialAccount, User } from '../utils/user'
import { lRouter } from '../router'
import type { Mediator } from '../types/shared'
import { LNavLink } from './LNavLink'
import { globe, pen } from './Icons'

export function LNav(pm: Mediator) {
  const user = new User()
  user.verifyCredentials()

  const profileLink = LNavLink({text: '', link: '/'}) //h('a', {attrs: { href: '/' } })
  const authorize = h('div', {className: 'navBar-link', onClick: onAuthorizeClick } , 'Login')
  const logoutLink = LNavLink({text: 'Logout', link: '#', onClick: onLogoutClick}) //h('a', {attrs: { href: '#' }}  , 'Logout')
  const composeLink = LNavLink({text: 'Compose', link: '/compose', icon: pen, onClick: onComposeClick})
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
    signupContainer,
  ])

  user.addOnUserChangeCb((u: CredentialAccount) => {
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
  })

  user.addOnUserChangeCb(u => {
    composeLink.el.style.display = u.isLoaded() ? 'inline-flex' : 'none'

    updLogoutVisibility()
  });

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

  function updLogoutVisibility() {
    logoutLink.visible = user.isLoaded()
  }

  return {
    el,
  }

}
import { appConfig } from '../core/config'
import { store } from './store'
import { app } from '../core/app'
import { createSignal, on } from '../utils/signal'
import type { Account } from '../types/shared'
import { clearTokenInfo, verifyCredentials } from './auth'

export let user = createSignal<Account>({
  id: '',
  username: '',
  acct: '',
  url: '',
  display_name: '',
  note: '',
  avatar: '',
  fields: [],
})

// Sync user with localStorage
on(user, (newValue) => {
  console.log(newValue)
  if (newValue.id) store.setItem(USER_KEY, newValue)
  else store.removeItem(USER_KEY)
})

function clearUserData() {
  user({
    id: '',
    username: '',
    avatar: '',
    acct: '',
    display_name: '',
    note: '',
    url: '',
    fields: [],
  })
}

// function loadCachedUser() {
//   let tmp = store.getItem(USER_KEY)

//   if (tmp) user(JSON.parse(tmp) as Account)
// }

export function isLoaded() {
  return !!user().id
}

export async function refreshUserInfo() {
  if (isLoaded()) return
  let verifyResult = await verifyCredentials()

  // load authenticated user
  // if verify_credentials failed, assign an 'empty' user
  if (verifyResult.ok) {
    user(verifyResult.value)
  } else {
    clearUserData()
  }
}

export function logOut() {
  clearTokenInfo()
  app.clearStore()
  clearUserData()
  appConfig.server('')
}

let USER_KEY = 'user'

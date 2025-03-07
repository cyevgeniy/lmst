import { useAppConfig } from '../appConfig'
import { ProfileTimelineManager } from '../appManager'
import { Account } from '../types/shared'
import { h } from '../utils/dom'
import { fetchJson } from '../utils/fetch'

export interface FollowingPageOptions {
  pm: ProfileTimelineManager
  params?: Record<string, string>
}

const { server } = useAppConfig()

async function getFollowingAccounts(
  profileId: string | number,
): Promise<Account[]> {
  let _server = server(),
    res = await fetchJson(`${_server}/api/v1/accounts/${profileId}/following`)
  return res
}

export async function createFollowingPage(
  root: HTMLElement,
  opts: FollowingPageOptions,
) {
  const { params = {}, pm } = opts
  root.innerHTML = ''

  if (params.webfinger) {
    pm.profileWebfinger = params.webfinger
    let account = await pm.getAccount()

    getFollowingAccounts(account.id).then((accounts) => {
      accounts.forEach((account) => {
        console.log(account)
      })
    })
  }

  return {
    el: h('div'),
  }
}

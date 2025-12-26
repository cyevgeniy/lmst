import { Account, Status } from '../types/shared'
import { last } from '../utils/arrays'
import {
  lookupAccount,
  getAccount as getAccountAPI,
  getStatuses,
} from '../api/account'
import { createSignal, Signal } from '../utils/signal'

export interface ProfileTimeline {
  loadStatuses: () => Promise<Status[]>
  clearStatuses: () => void
  noMoreData: Signal<boolean>
  statuses: Status[]
  getAccount: () => Promise<Account>
  profileWebfinger: Signal<string>
  loading: Signal<boolean>
}

export function profileTimeline(): ProfileTimeline {
  let maxId = '',
    profileId = '',
    profileWebfinger = createSignal(''),
    statuses: Status[] = [],
    noMoreData = createSignal(false),
    loading = createSignal(false)

  async function loadStatuses(): Promise<Status[]> {
    if (!profileId) return []

    loading(true)
    const res = await getStatuses(profileId, { max_id: maxId })
    loading(false)
    if (res.ok) {
      if (res.value.length) {
        maxId = last(res.value)!.id
        return res.value
      } else noMoreData(true)
    }

    return []
  }

  function clearStatuses() {
    maxId = ''
    statuses = []
    noMoreData(false)
  }

  async function getAccount() {
    // Check whether profileId is a string
    if (!profileId && profileWebfinger()) {
      const acc = await lookupAccount(profileWebfinger())
      profileId = acc.id

      return acc
    }

    return await getAccountAPI(profileId)
  }

  return {
    noMoreData,
    profileWebfinger,
    loading,
    statuses,
    loadStatuses,
    getAccount,
    clearStatuses,
  }
}

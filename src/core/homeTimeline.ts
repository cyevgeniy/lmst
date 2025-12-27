import { getHomeTimeline, getPublicTimeline } from '../api/timeline'
import { Status } from '../types/shared'
import { last } from '../utils/arrays'
import { noop } from '../utils/shared'
import { createSignal } from '../utils/signal'
import { appConfig } from './config'
import { isLoaded as isUserLoaded } from './user'

export function createHomeTimeline() {
  let maxId = '',
    onClearStatuses: () => void = noop,
    noMoreData = createSignal(false),
    loading = createSignal(false)

  async function loadStatuses(): Promise<Status[]> {
    let { server } = appConfig,
      fn = isUserLoaded() ? getHomeTimeline : getPublicTimeline

    loading(true)

    let st = await fn.call(null, server(), { max_id: maxId })

    loading(false)

    if (st.ok) {
      let statuses = st.value

      if (statuses.length) {
        maxId = last(statuses)!.id
        return statuses
      } else {
        // no more records
        noMoreData(true)
      }
    }

    return []
  }

  function clearStatuses() {
    maxId = ''
    onClearStatuses()
    noMoreData(false)
  }

  return {
    noMoreData,
    loadStatuses,
    onClearStatuses,
    clearStatuses,
    loading,
  }
}

export let homeTimeline = createHomeTimeline()

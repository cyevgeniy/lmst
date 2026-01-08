import { getTagTimeline } from '../api/timeline'
import { Status } from '../types/shared'
import { last } from '../utils/arrays'
import { createSignal } from '../utils/signal'
import { appConfig } from './config'

export function tagTimeline() {
  let maxId: string = '',
    noMoreData = createSignal(false),
    loading = createSignal(false)

  async function loadStatuses(tagText: string) {
    loading(true)
    const resp = await getTagTimeline(tagText, {
      server: appConfig.server(),
      params: { max_id: maxId },
    })

    let statuses: Status[] = []

    if (resp.ok) {
      statuses = resp.value
      if (statuses.length) maxId = last(statuses)!.id
      else noMoreData(true)
    }

    loading(false)

    return statuses
  }

  async function clearStatuses() {
    noMoreData(false)
  }

  return {
    noMoreData,
    loadStatuses,
    clearStatuses,
    loading,
  }
}

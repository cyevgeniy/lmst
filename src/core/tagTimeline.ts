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

// export class TagsTimelineManager implements ITimelineManager {
//   private maxId: string
//   public statuses: Status[]
//   /**
//    * Stores last loaded statuses list
//    */
//   private appConfig: AppConfig
//   private keepStatuses: boolean
//   public tag: string
//   public noMoreData: boolean

//   constructor(opts: { keepStatuses: boolean }) {
//     this.maxId = ''
//     this.keepStatuses = opts.keepStatuses
//     this.tag = ''
//     this.statuses = []
//     this.noMoreData = false
//     this.appConfig = appConfig
//   }

//   public async loadStatuses() {
//     const resp = await getTagTimeline(this.tag, {
//       server: this.appConfig.server(),
//       params: { max_id: this.maxId },
//     })

//     let statuses: Status[] = []

//     if (resp.ok) {
//       statuses = resp.value
//       this.keepStatuses && this.statuses.push(...statuses)

//       if (statuses.length) this.maxId = last(statuses)!.id
//       else this.noMoreData = true
//     }

//     return statuses
//   }

//   public clearStatuses() {
//     this.statuses = []
//     this.noMoreData = false
//   }
// }

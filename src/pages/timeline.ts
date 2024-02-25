import { LStatusesList } from '../components/LStatusesList'
import { getPublicTimeline, getHomeTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'
import { useTimeline } from '../stores/useTimeline'
import {useAppConfig} from '../appConfig'
import { definePage } from '../utils/page.ts'
import { User } from '../utils/user.ts'

export const timelinePage = definePage(() => {
  let el: HTMLElement
  let timelineContainer: HTMLElement
  let loadMoreBtn: HTMLButtonElement
  let maxId = ''
  let statusesList: LStatusesList
  const user = new User()
  const config = useAppConfig()

  const { timeline } = useTimeline()

  async function loadStatuses() {
    await user.verifyCredentials()
    user.loadTokenFromStore()
    let fn = async () => await getPublicTimeline(config.server, {max_id: maxId}) as Status[]

    if (user.isLoaded())
      fn = async () => await getHomeTimeline(config.server, user.accessToken(),  {max_id: maxId})
    
      const statuses = await fn()
    statusesList?.addStatuses(statuses)
    timeline.push(...statuses)
    maxId = statuses[statuses.length - 1].id
  }

  function mount(): HTMLElement {
    loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    const statusesListEl = h('div')
    statusesList = new LStatusesList(statusesListEl, [])

    timelineContainer = h('div', {class: 'timeline-container'}, [statusesListEl, loadMoreBtn])
    el = h('div', {attrs: {id: 'timeline-root'}}, [timelineContainer, loadMoreBtn])

    return el
  }

  async function onParamsChange(_?: Record<string,string>) {
    console.log('onParamsChange')
    if (timeline.length === 0)
      loadStatuses()
    else
      statusesList?.addStatuses(timeline)
  }

  return {
    mount,
    onParamsChange,
  }
})

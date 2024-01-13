import { registerApp } from '../utils/app'
import { LStatusesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'
import { useTimeline } from '../stores/useTimeline'
import config from '../appConfig'
import type { PageConstructor } from './page.ts'
import type { StatusesListComponent } from '../components/LStatusesList'

export const Timeline: PageConstructor = () => {
  let el: HTMLElement
  let timelineContainer: HTMLElement
  let loadMoreBtn: HTMLButtonElement
  let maxId = ''
  let statusesList: StatusesListComponent

  const { timeline } = useTimeline()

  async function loadStatuses() {
    const token = await registerApp()
    const statuses = await getPublicTimeline(config.server, token, {max_id: maxId}) as Status[]
    statusesList?.addStatuses(statuses)
    timeline.push(...statuses)
    maxId = statuses[statuses.length - 1].id
  }

  function mount(): HTMLElement {
    loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    const statusesListEl = h('div')
    statusesList = LStatusesList(statusesListEl, [])
    statusesList.mount()

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
}

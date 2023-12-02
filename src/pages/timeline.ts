import { registerApp } from '../utils/app'
import { LStatuesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'
import { useTimeline } from '../stores/useTimeline'
import config from '../appConfig'
import type { PageConstructor } from './page.ts'

export const Timeline: PageConstructor = () => {
  let el: HTMLElement
  let timelineContainer: HTMLElement
  let loadMoreBtn: HTMLButtonElement
  let maxId = ''

  let addStatuses: undefined | ((statuses: Status[]) => void) = undefined

  const { timeline } = useTimeline()

  async function loadStatuses() {
    const token = await registerApp()
    const statuses = await getPublicTimeline(config.server, token, {max_id: maxId}) as Status[]
    addStatuses?.(statuses)
    timeline.push(...statuses)
    maxId = statuses[statuses.length - 1].id
  }

  function mount(): HTMLElement {
    loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    const statusesList = LStatuesList([])
    const statusesListEl = statusesList.mount()

    addStatuses = statusesList.appendStatuses

    timelineContainer = h('div', {class: 'timeline-container'}, [statusesListEl, loadMoreBtn])
    el = h('div', {attrs: {id: 'timeline-root'}}, [timelineContainer, loadMoreBtn])

    return el
  }

  async function onParamsChange(_?: Record<string,string>) {
    console.log('onParamsChange')
    if (timeline.length === 0)
      loadStatuses()
    else
      addStatuses?.(timeline)
  }

  return {
    mount,
    onParamsChange,
  }
}

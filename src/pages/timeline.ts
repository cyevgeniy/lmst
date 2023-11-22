import { registerApp } from '../utils/app'
import { LStatuesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'
import { useTimeline } from '../stores/useTimeline'
import config from '../appConfig'

export function Timeline() {
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

  function render(): HTMLElement {
    loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    const { el: statusesListEl, add } = LStatuesList()
    addStatuses= add

    timelineContainer = h('div', {class: 'timeline-container'}, [statusesListEl, loadMoreBtn])
    el = h('div', {attrs: {id: 'timeline-root'}}, [timelineContainer, loadMoreBtn])

    return el
  }

  async function onMount(_?: Record<string,string>) {
    console.log('onMount')
    if (timeline.length === 0)
      loadStatuses()
    else
      addStatuses?.(timeline)
  }

  return {
    render,
    onMount,
  }
}

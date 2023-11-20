import { registerApp } from '../utils/app'
import { LStatuesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'

export function Timeline() {
  let el: HTMLElement
  let timelineContainer: HTMLElement
  let loadMoreBtn: HTMLButtonElement
  let maxId = ''

  let addStatuses: undefined | ((statuses: Status[]) => void) = undefined

  async function loadStatuses() {
    const token = await registerApp()
    const statuses = await getPublicTimeline('https://social.vivaldi.net', token, {max_id: maxId}) as Status[]
    //timelineContainer.appendChild(statusesListEl)
    addStatuses?.(statuses)
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
    loadStatuses()
  }

  return {
    render,
    onMount,
  }
}

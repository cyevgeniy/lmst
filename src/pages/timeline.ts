import { registerApp } from '../utils/app'
import { LStatuesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'

export function Timeline() {
  let el: HTMLElement
  let timeline: any = []

  function render(): HTMLElement {
    el = document.createElement('div')
    el.setAttribute('id', 'timeline-root')
    el.classList.add('timeline-container')

    return el
  }

  async function onMount() {
    const token = await registerApp()
    timeline = await getPublicTimeline('https://mastodon.social', token) as Status[]
    const { el: statusesListEl } = LStatuesList(timeline)
    el.appendChild(statusesListEl)
  }

  return {
    render,
    onMount,
  }
}

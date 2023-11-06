import { registerApp } from '../utils/app'
import { LStatuesList } from '../components/LStatusesList'
import { getPublicTimeline } from '../api/timeline'
import type { Status } from '../types/shared.d.ts'
import { h } from '../utils/dom'

export function Timeline() {
  let el: HTMLElement
  let timeline: any = []

  function render(): HTMLElement {
    el = h('div', {class: 'timeline-container', attrs: {id: 'timeline-root'}})
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

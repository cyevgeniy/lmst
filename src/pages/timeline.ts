import { registerApp } from '../utils/app'
import { LPost } from '../components/LPost'
import { getPublicTimeline } from '../api/timeline'

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
    timeline = await getPublicTimeline('https://mastodon.social', token)
    for (const post of timeline) {
        const { el: postEl } = LPost({content: post.content, created_at: post.created_at, account: post.account})
        el?.appendChild(postEl)
    }
  }

  return {
    render,
    onMount,
  }
}

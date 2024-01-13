import { PageConstructor } from './page'
import { LStatusesList } from '../components/LStatusesList'
import type { StatusesListComponent } from '../components/LStatusesList'
import { getStatuses } from '../api/account'
import { h } from '../utils/dom'
export const Profile: PageConstructor = () => {

  let el: HTMLElement
  let statusesEl: HTMLElement
  let statusesList: StatusesListComponent
  let profileHeader: HTMLElement
  let profileId: string = ''
  let maxId = ''

  let rendered = false

  function loadStatuses(): Promise<void> {
    return getStatuses(profileId, {max_id: maxId}).then((resp) => {
      console.log(resp)
      statusesList.addStatuses(resp)
      maxId = resp[resp.length - 1].id
    })
  }

  function render() {
    const loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    statusesEl = h('div')
    statusesList = LStatusesList(statusesEl, [])
    statusesList.mount()
    const timelineContainer = h('div', {class: 'timeline-container'}, [statusesEl, loadMoreBtn])
    profileHeader = h('h2')
    el = h('div', {attrs: {id: 'timeline-root'}}, [profileHeader, timelineContainer, loadMoreBtn])

    rendered = true
  }

  function update(params?: Record<string, string>) {
    profileId = params?.id ?? ''
    profileHeader.innerText = `Profile ${profileId}`
    loadStatuses()
  }

  function mount() {
    if (rendered)
      return el

    render()
    return el
  }

  function onParamsChange(params?: Record<string, string>) {
    update(params)
  }

  return { mount, onParamsChange }
}

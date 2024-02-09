import { definePage } from '../utils/page'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import type { ProfileHeaderComponent } from '../components/ProfileHeader'
import type { StatusesListComponent } from '../components/LStatusesList'
import { getAccount, getStatuses } from '../api/account'
import { h, div } from '../utils/dom'

export const profilePage = definePage(() => {

  let el: HTMLElement
  let statusesEl: HTMLElement
  let statusesList: StatusesListComponent
  let profileHeader: HTMLElement
  let profileHeaderComponent: ProfileHeaderComponent
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
    profileHeader = h('div')
    profileHeaderComponent = LProfileHeader(profileHeader)
    statusesList.mount()
    profileHeaderComponent.mount()
    const timelineContainer = div('timeline-container', [statusesEl, loadMoreBtn])

    el = h('div', {attrs: {id: 'timeline-root'}}, [profileHeader, timelineContainer, loadMoreBtn])




    rendered = true
  }

  function update(params?: Record<string, string>) {
    profileId = params?.id ?? ''
    getAccount(profileId).then(resp => profileHeaderComponent.update(resp))
    //profileHeader.innerText = `Profile ${profileId}`
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
})

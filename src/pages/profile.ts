import { definePage } from '../utils/page'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { getAccount, getStatuses } from '../api/account'
import { h, div } from '../utils/dom'

export const profilePage = definePage(() => {

  let el: HTMLElement
  let statusesEl: HTMLElement
  let statusesList: LStatusesList
  let profileHeader: HTMLElement
  let profileHeaderComponent: LProfileHeader
  let profileId: string = ''
  let maxId = ''

  let rendered = false

  async function loadStatuses(): Promise<void> {
    const resp = await getStatuses(profileId, { max_id: maxId })
    statusesList.addStatuses(resp)
    maxId = resp[resp.length - 1].id
  }

  function render() {
    const loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    loadMoreBtn.addEventListener('click', () => loadStatuses())

    statusesEl = h('div')
    statusesList = new LStatusesList(statusesEl, [])
    profileHeader = h('div')
    profileHeaderComponent = new LProfileHeader(profileHeader)
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

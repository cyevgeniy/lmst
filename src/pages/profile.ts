import type { Mediator } from '../types/shared'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div, hide, show } from '../utils/dom'
import { ProfileTimelineManager, StatusManager } from '../appManager'

interface ProfilePageConstructorParams {
  pm: ProfileTimelineManager
  pageMediator: Mediator
  sm: StatusManager,
  params?: Record<string, string>
}

export function createProfilePage(
  root: HTMLElement,
  opts: ProfilePageConstructorParams
) {
    root.innerHTML = ''
    let profileId = ''

    const noMoreDataText = h('div', {className: 'timelime-no-more-rows'}, 'No more records')
    hide(noMoreDataText)

    const loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => loadStatuses() })
    const loadMoreBtnContainer = div('timeline__load-more-container', [loadMoreBtn.el, noMoreDataText])

    const timelineContainer = div('timeline-container')
    let statusesList = new LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: opts.sm
    })

    timelineContainer.appendChild(loadMoreBtnContainer)

    const el = h('div', {attrs: {id: 'timeline-root'}})//, [profileHeader, timelineContainer, loadMoreBtn])
    const profileHeaderComponent = new LProfileHeader(el)
    el.appendChild(timelineContainer)
    root.appendChild(el)

    async function loadStatuses() {
      if (!profileId)
        return
  
      // xxx: check for errors here or in profileManager and return an
      // empty array?
      loadMoreBtn.loading = true
      const statuses = await opts.pm.loadStatuses()
  
      if (opts.pm.noMoreData) {
        show(noMoreDataText)
        loadMoreBtn.visible = false
      } else {
        hide(noMoreDataText)
        loadMoreBtn.visible = true
      }
  
      loadMoreBtn.loading = false
      statusesList.addStatuses(statuses)
    }

    // Creates a 'not found' message
    function createNotFound(webfinger: string) {
      el.replaceChildren(
        h('div', {
          className: 'profile__notfound'},
          `Account ${webfinger} was not found`
        )
      )
    }

    async function loadProfileInfo(params?: Record<string, string>) {
      const webfinger = params?.webfinger ?? ''
  
      opts.pm.profileWebfinger = webfinger
  
      try {
        const resp = await opts.pm.getAccount()
        profileId = resp.id
        profileHeaderComponent.update(resp)
      }
      catch(e: unknown) {
        createNotFound(webfinger)
        console.error(e)
      }
  
      await loadStatuses()
    }

    loadProfileInfo(opts.params) 
}

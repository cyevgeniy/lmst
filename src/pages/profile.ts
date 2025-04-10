import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { h, div, hide, show, childs } from '../utils/dom'
import { ProfileTimelineManager, StatusManager } from '../appManager'
import { logErr } from '../utils/errors'

interface ProfilePageConstructorParams {
  pm: ProfileTimelineManager
  sm: StatusManager
  params?: Record<string, string>
}

export function createProfilePage(
  root: HTMLElement,
  opts: ProfilePageConstructorParams,
) {
  root.innerHTML = ''
  let profileId = '',
    noMoreDataText = LNoMoreRows(),
    loadMoreBtn = LLoadMoreBtn({
      text: 'Load more',
      onClick: () => loadStatuses(),
    }),
    loadMoreBtnContainer = div('timeline__load-more-container', [
      loadMoreBtn.el,
      noMoreDataText,
    ]),
    timelineContainer = div('timeline-container'),
    statusesList = LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: opts.sm,
    })

  hide(noMoreDataText)

  timelineContainer.appendChild(loadMoreBtnContainer)

  let el = h('div', { attrs: { id: 'timeline-root' } }),
    profileHeaderComponent = LProfileHeader()

  childs(el, [profileHeaderComponent, timelineContainer])
  root.appendChild(el)

  async function loadStatuses() {
    if (!profileId) return

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
      h(
        'div',
        {
          className: 'profile__notfound',
        },
        `Account ${webfinger} was not found`,
      ),
    )
  }

  async function loadProfileInfo(params?: Record<string, string>) {
    let webfinger = params?.webfinger ?? ''

    opts.pm.profileWebfinger = webfinger

    try {
      let resp = await opts.pm.getAccount()
      profileId = resp.id
      profileHeaderComponent.update(resp)
    } catch (e: unknown) {
      createNotFound(webfinger)
      if (import.meta.env.DEV) logErr(e)
    }

    await loadStatuses()
  }

  loadProfileInfo(opts.params)

  return {
    el,
  }
}

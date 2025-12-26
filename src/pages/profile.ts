import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { h, div, hide, show, childs } from '../utils/dom'
import { StatusManager } from '../appManager'
import { logErr } from '../utils/errors'
import { profileTimeline } from '../core/profileTimeline'
import { on } from '../utils/signal'

interface ProfilePageConstructorParams {
  sm: StatusManager
  params?: Record<string, string>
}

export function createProfilePage(
  root: HTMLElement,
  opts: ProfilePageConstructorParams,
) {
  root.innerHTML = ''
  let pm = profileTimeline(),
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

  on(pm.loading, (newVal) => {
    loadMoreBtn.loading = newVal
  })

  on(pm.noMoreData, (newVal) => {
    if (newVal) {
      show(noMoreDataText)
      loadMoreBtn.visible = false
    } else {
      hide(noMoreDataText)
      loadMoreBtn.visible = true
    }
  })

  hide(noMoreDataText)

  childs(timelineContainer, [loadMoreBtnContainer])

  let el = h('div', { attrs: { id: 'timeline-root' } }),
    profileHeaderComponent = LProfileHeader()

  childs(el, [profileHeaderComponent, timelineContainer])
  childs(root, [el])

  async function loadStatuses() {
    // xxx: check for errors here or in profileManager and return an
    // empty array?
    const statuses = await pm.loadStatuses()

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

    pm.profileWebfinger(webfinger)

    try {
      let resp = await pm.getAccount()
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

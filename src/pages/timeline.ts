import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { LButton } from '../components/LButton'
import { PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE } from '../api/timeline'
import { globalNavigation } from '../core/globalNavigation.ts'
import { childs, div, h, hide, show } from '../utils/dom'
import { on } from '../utils/signal.ts'
import { homeTimeline } from '../core/homeTimeline.ts'

export function createTimelinePage(root: HTMLElement) {
  root.innerHTML = ''

  let noMoreDataText = LNoMoreRows(),
    timelineNoticeText = h('p', { className: 'timeline__notice-text' }),
    timelineNoticeLoginBtn = LButton({
      text: 'Sign in',
      onClick: () => globalNavigation.login(),
    }),
    timelineNotice = div('timeline__notice', [
      timelineNoticeText,
      timelineNoticeLoginBtn.el,
    ]),
    loadMoreBtn = LLoadMoreBtn({
      text: 'Load more',
      onClick: () => loadMore(),
    }),
    loadMoreBtnContainer = div('timeline__load-more-container', [
      loadMoreBtn.el,
      noMoreDataText,
    ]),
    statusesListEl = h('div'),
    statusesList = LStatusesList({
      root: statusesListEl,
      statuses: [],
    })

  hide(noMoreDataText)
  hide(timelineNotice)

  homeTimeline.onClearStatuses = statusesList.clearStatuses

  let timelineContainer = h('div', { className: 'timeline-container' }, [
      timelineNotice,
      statusesListEl,
      loadMoreBtnContainer,
    ]),
    el = h('div', { attrs: { id: 'timeline-root' } }, [timelineContainer])

  on(homeTimeline.loading, (newVal) => {
    loadMoreBtn.loading = newVal
  })

  on(homeTimeline.noMoreData, (newVal) => {
    if (newVal) {
      show(noMoreDataText)
      loadMoreBtn.visible = false
    } else {
      hide(noMoreDataText)
      loadMoreBtn.visible = true
    }
  })

  on(homeTimeline.errorMessage, (newVal) => {
    if (newVal) {
      timelineNoticeText.textContent = newVal
      timelineNoticeLoginBtn.el.style.display =
        newVal === PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE ? '' : 'none'
      show(timelineNotice)
      hide(noMoreDataText)
      loadMoreBtn.visible = false
    } else {
      timelineNoticeText.textContent = ''
      timelineNoticeLoginBtn.el.style.display = 'none'
      hide(timelineNotice)
      loadMoreBtn.visible = true
    }
  })

  async function loadMore() {
    let st = await homeTimeline.loadStatuses()

    statusesList?.addStatuses(st)
  }

  childs(root, [el])
  loadMore()

  return {
    el,
  }
}

import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { childs, div, h, hide, show } from '../utils/dom'
import { on } from '../utils/signal.ts'
import { homeTimeline } from '../core/homeTimeline.ts'

export function createTimelinePage(root: HTMLElement) {
  root.innerHTML = ''

  let noMoreDataText = LNoMoreRows(),
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

  homeTimeline.onClearStatuses = statusesList.clearStatuses

  let timelineContainer = h('div', { className: 'timeline-container' }, [
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

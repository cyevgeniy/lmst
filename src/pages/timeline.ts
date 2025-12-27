import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { childs, div, h, hide } from '../utils/dom'
import type { AppManager } from '../appManager.ts'
import { on } from '../utils/signal.ts'

export function createTimelinePage(root: HTMLElement, appManager: AppManager) {
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

  appManager.timelineManager.onClearStatuses = statusesList.clearStatuses

  let timelineContainer = h('div', { className: 'timeline-container' }, [
      statusesListEl,
      loadMoreBtnContainer,
    ]),
    el = h('div', { attrs: { id: 'timeline-root' } }, [timelineContainer])

  on(appManager.timelineManager.loading, (newVal) => {
    loadMoreBtn.loading = newVal
  })

  async function loadMore() {
    let st = await appManager.timelineManager.loadStatuses()
    if (appManager.timelineManager.noMoreData()) {
      noMoreDataText.style.display = 'block'
      loadMoreBtn.visible = false
    } else {
      noMoreDataText.style.display = 'none'
      loadMoreBtn.visible = true
    }

    statusesList?.addStatuses(st)
  }

  childs(root, [el])
  loadMore()

  return {
    el,
  }
}

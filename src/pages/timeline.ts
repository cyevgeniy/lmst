import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { div, h, hide } from '../utils/dom'
import type { AppManager } from '../appManager.ts'

export function createTimelinePage(
  root: HTMLElement,
  appManager: AppManager,
) {
  root.innerHTML = ''

  const noMoreDataText = h('div', { className: 'timelime-no-more-rows' }, 'No more records')
  hide(noMoreDataText)

  const loadMoreBtn = LLoadMoreBtn({ text: 'Load more', onClick: () => loadMore() })
  const loadMoreBtnContainer = div('timeline__load-more-container', [loadMoreBtn.el, noMoreDataText])

  const statusesListEl = h('div')
  const statusesList = LStatusesList({
    root: statusesListEl,
    statuses: [],
    sm: appManager.statusManager
  })

  appManager.timelineManager.onClearStatuses(() => {
    statusesList.clearStatuses()
  })

  const timelineContainer = h('div', { className: 'timeline-container' }, [statusesListEl, loadMoreBtnContainer])
  const el = h('div', { attrs: { id: 'timeline-root' } }, [timelineContainer])

  async function loadMore() {
    loadMoreBtn.loading = true
    const st = await appManager.timelineManager.loadStatuses()
    if (appManager.timelineManager.noMoreData) {
      noMoreDataText.style.display = 'block'
      loadMoreBtn.visible = false
    } else {
      noMoreDataText.style.display = 'none'
      loadMoreBtn.visible = true
    }

    loadMoreBtn.loading = false
    statusesList?.addStatuses(st)
  }

  root.appendChild(el)
  loadMore()

  return {
    el,
  }
}

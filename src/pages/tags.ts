import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { childs, div, h, hide, show } from '../utils/dom'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { tagTimeline } from '../core/tagTimeline'
import { on } from '../utils/signal'

export function createTagsPage(
  root: HTMLElement,
  params?: Record<string, string>,
) {
  let {
    noMoreData,
    clearStatuses,
    loadStatuses: fetchStatuses,
    loading,
  } = tagTimeline()
  root.innerHTML = ''

  let tagHeader = h('h2', { className: 'tagHeader' }),
    noMoreDataText = LNoMoreRows('No more records'),
    loadMoreBtn = LLoadMoreBtn({
      text: 'Load more',
      onClick: () => loadStatuses(tagParameter),
    }),
    loadMoreBtnContainer = div('timeline__load-more-container', [
      loadMoreBtn.el,
      noMoreDataText,
    ]),
    timelineContainer = div('timeline-container', []),
    statusesList = LStatusesList({
      root: timelineContainer,
      statuses: [],
    })

  hide(noMoreDataText)

  timelineContainer.appendChild(loadMoreBtnContainer)

  let el = h('div', { attrs: { id: 'timeline-root' } }, [
    tagHeader,
    timelineContainer,
    loadMoreBtnContainer,
  ])

  childs(root, [el])

  on(loading, (newVal) => {
    loadMoreBtn.loading = newVal
  })

  async function loadStatuses(tagText: string) {
    let statuses = await fetchStatuses(tagText)

    if (noMoreData()) {
      show(noMoreDataText)
      loadMoreBtn.visible = false
    } else {
      hide(noMoreDataText)
      loadMoreBtn.visible = true
    }

    statusesList.addStatuses(statuses)
  }

  let tagParameter = params?.tag ?? ''

  tagHeader.innerText = `#${tagParameter}`

  clearStatuses()

  loadStatuses(tagParameter)

  return {
    el,
  }
}

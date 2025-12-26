import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div, hide, show, childs } from '../utils/dom'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { tagTimeline } from '../core/tagTimeline'
import { on } from '../utils/signal'

export function createTagsPage(
  root: HTMLElement,
  params?: Record<string, string>,
) {
  let {
    tag,
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
      onClick: () => loadStatuses(tag()),
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
    tag(tagText)
    let statuses = await fetchStatuses()

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

  tag(tagParameter)
  tagHeader.innerText = `#${tag()}`

  clearStatuses()

  loadStatuses(tag())

  return {
    el,
  }
}

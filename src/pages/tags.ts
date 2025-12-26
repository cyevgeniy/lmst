import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div, hide, show, childs } from '../utils/dom'
import { AppManager } from '../appManager'
import { LNoMoreRows } from '../components/LNoMoreRows'

export function createTagsPage(
  root: HTMLElement,
  appManager: AppManager,
  params?: Record<string, string>,
) {
  root.innerHTML = ''

  let tagHeader = h('h2', { className: 'tagHeader' }),
    noMoreDataText = LNoMoreRows('No more records'),
    loadMoreBtn = LLoadMoreBtn({
      text: 'Load more',
      onClick: () => loadStatuses(appManager.tagsManager.tag),
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

  async function loadStatuses(tag: string) {
    loadMoreBtn.loading = true
    appManager.tagsManager.tag = tag
    let statuses = await appManager.tagsManager.loadStatuses()

    if (appManager.tagsManager.noMoreData) {
      show(noMoreDataText)
      loadMoreBtn.visible = false
    } else {
      hide(noMoreDataText)
      loadMoreBtn.visible = true
    }

    loadMoreBtn.loading = false
    statusesList.addStatuses(statuses)
  }

  let tag = params?.tag ?? ''

  appManager.tagsManager.tag = tag
  tagHeader.innerText = `#${tag}`

  appManager.tagsManager.clearStatuses()

  loadStatuses(tag)

  return {
    el,
  }
}

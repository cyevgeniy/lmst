import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div, hide, show } from '../utils/dom'
import { AppManager } from '../appManager'

export function createTagsPage(
  root: HTMLElement,
  appManager: AppManager,
  params?: Record<string, string>
) {
  root.innerHTML = ''

    const tagHeader = h('h2')

    const noMoreDataText = h('div', {className: 'timelime-no-more-rows'}, 'No more records')
    hide(noMoreDataText)

    const loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => loadStatuses(appManager.tagsManager.tag) })
    const loadMoreBtnContainer = div('timeline__load-more-container', [loadMoreBtn.el, noMoreDataText])

    const timelineContainer = div('timeline-container', [])
    const statusesList = new LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: appManager.statusManager
    })

    timelineContainer.appendChild(loadMoreBtnContainer)

    const el = h('div', {attrs: {id: 'timeline-root'}}, [tagHeader, timelineContainer, loadMoreBtnContainer])
    root.appendChild(el)
    
    async function loadStatuses(tag: string) {
      loadMoreBtn.loading = true
      appManager.tagsManager.tag = tag
      await appManager.tagsManager.loadStatuses()
  
      if (appManager.tagsManager.noMoreData) {
        show(noMoreDataText)
        loadMoreBtn.visible = false
      } else {
        hide(noMoreDataText)
        loadMoreBtn.visible = true
      }
  
      loadMoreBtn.loading = false
      statusesList.addStatuses(appManager.tagsManager.lastChunk)
    }

    const tag = params?.tag ?? ''

    appManager.tagsManager.tag = tag
    tagHeader.innerText = `#${tag}`

    appManager.tagsManager.clearStatuses()

    loadStatuses(tag)
}

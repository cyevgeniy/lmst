import { IPage, Page } from '../utils/page'
import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div } from '../utils/dom'
import { TagsTimelineManager, AppManager } from '../appManager'

export class TagsPage extends Page implements IPage {
  private el: HTMLElement
  private statusesList: LStatusesList
  private loadMoreBtn: LLoadMoreBtn
  private tagHeader: HTMLHeadElement
  private noMoreDataText: HTMLDivElement

  private tagsManager: TagsTimelineManager

  constructor(appManager: AppManager) {
    super(appManager.globalMediator)
    this.tagsManager = appManager.tagsManager
    this.tagHeader = h('h2', null, '')

    this.noMoreDataText = h('div', {class: 'timelime-no-more-rows'}, 'No more records')
    this.noMoreDataText.style.display = 'none'

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadStatuses(this.tagsManager.tag) })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el, this.noMoreDataText])

    const timelineContainer = div('timeline-container', [])
    this.statusesList = new LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: appManager.statusManager
    })

    timelineContainer.appendChild(loadMoreBtnContainer)

    this.el = h('div', {attrs: {id: 'timeline-root'}})
    this.el.appendChild(this.tagHeader)
    this.el.appendChild(timelineContainer)
    this.el.appendChild(loadMoreBtnContainer)
  }

  public mount(params?: Record<string, string>) {
    super.mount()
    this.layout.middle.innerHTML = ''
    this.layout.middle.appendChild(this.el)
    this.onParamsChange(params)
  }

  private async loadStatuses(tag: string) {
    this.loadMoreBtn.loading = true
    this.tagsManager.tag = tag
    await this.tagsManager.loadStatuses()

    if (this.tagsManager.noMoreData) {
      this.noMoreDataText.style.display = 'block'
      this.loadMoreBtn.el.style.display = 'none'
    } else {
      this.noMoreDataText.style.display = 'none'
      this.loadMoreBtn.el.style.display = 'block'
    }

    this.loadMoreBtn.loading = false
    this.statusesList.addStatuses(this.tagsManager.lastChunk)
  }

  public async onParamsChange(params?: Record<string, string>) {
    const tag = params?.tag ?? ''

    this.tagsManager.tag = tag
    this.tagHeader.innerText = `#${tag}`

    this.tagsManager.clearStatuses()

    await this.loadStatuses(tag)
  }
}

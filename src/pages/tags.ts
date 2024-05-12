import { IPage, Page } from '../utils/page'
import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div } from '../utils/dom'
import { TagsTimelineManager, AppManager } from '../appManager'

export class TagsPage extends Page implements IPage {
  private el: HTMLElement
  private statusesList: LStatusesList
  private loadMoreBtn: LLoadMoreBtn

  private tagsManager: TagsTimelineManager

  constructor(appManager: AppManager) {
    super(appManager.globalMediator)
    this.tagsManager = appManager.tagsManager

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadStatuses(this.tagsManager.tag) })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el])

    const timelineContainer = div('timeline-container', [])
    this.statusesList = new LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: appManager.statusManager
    })

    timelineContainer.appendChild(loadMoreBtnContainer)

    this.el = h('div', {attrs: {id: 'timeline-root'}})//, [profileHeader, timelineContainer, loadMoreBtn])
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
    this.loadMoreBtn.loading = false
    this.statusesList.addStatuses(this.tagsManager.lastChunk)
  }

  public async onParamsChange(params?: Record<string, string>) {
    const tag = params?.tag ?? ''

    this.tagsManager.tag = tag

    this.tagsManager.clearStatuses()
    await this.loadStatuses(tag)
  }
}

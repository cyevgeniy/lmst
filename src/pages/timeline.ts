import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { div, h } from '../utils/dom'
import { Page } from '../utils/page.ts'
import type { IPage } from '../utils/page'
import type { TimelineManager } from '../appManager.ts'
import type { Mediator } from '../types/shared'

export class TimelinePage extends Page implements IPage {
  private el: HTMLElement
  private timelineContainer: HTMLElement
  private loadMoreBtn: LLoadMoreBtn
  private statusesList: LStatusesList

  private timelineManager: TimelineManager

  constructor(tm: TimelineManager, pm: Mediator) {
    super(pm)

    this.timelineManager = tm

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadMore() })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el])

    const statusesListEl = h('div')
    this.statusesList = new LStatusesList(statusesListEl, [])

    this.timelineManager.onClearStatuses(() => {
      this.statusesList.clearStatuses()
    })

    this.timelineContainer = h('div', {class: 'timeline-container'}, [statusesListEl, loadMoreBtnContainer])
    this.el = h('div', {attrs: {id: 'timeline-root'}}, [this.timelineContainer, loadMoreBtnContainer])
  }

  private async loadMore() {
    this.loadMoreBtn.loading = true
    const st = await this.timelineManager.loadStatuses()
    this.loadMoreBtn.loading = false
    this.statusesList?.addStatuses(st)
  }

  public mount(params?: Record<string, string>) {
    super.mount()
    this.timelineManager.clearStatuses()
    this.layout.middle.appendChild(this.el)
    this.onParamsChange(params)
  }

  /**
   * Later we should cache fetched timeline and merge it with new
   * timeline after we navigate from the 'compose' page
   */
  public async onParamsChange(_?: Record<string,string>) {
    await this.loadMore()
  }
}

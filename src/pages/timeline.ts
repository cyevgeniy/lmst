import { LStatusesList } from '../components/LStatusesList'
import { h } from '../utils/dom'
import { Page } from '../utils/page.ts'
import type { IPage } from '../utils/page'
import type { TimelineManager } from '../appManager.ts'

export class TimelinePage extends Page implements IPage {
  private el: HTMLElement
  private timelineContainer: HTMLElement
  private loadMoreBtn: HTMLButtonElement
  private statusesList: LStatusesList

  private timelineManager: TimelineManager
  
  constructor(tm: TimelineManager) {
    super()

    this.timelineManager = tm
    this.loadMoreBtn = h('button', {class: "timeline__load-more"}, 'Load more') as HTMLButtonElement
    this.loadMoreBtn.addEventListener('click', () => this.loadMore())

    const statusesListEl = h('div')
    this.statusesList = new LStatusesList(statusesListEl, [])

    this.timelineContainer = h('div', {class: 'timeline-container'}, [statusesListEl, this.loadMoreBtn])
    this.el = h('div', {attrs: {id: 'timeline-root'}}, [this.timelineContainer, this.loadMoreBtn])  
  }

  private async loadMore() {
    const st = await this.timelineManager.loadStatuses()
    this.statusesList?.addStatuses(st)
  }

  public mount(params?: Record<string, string>) {
    super.mount()
    this.timelineManager.resetPagination()
    this.layout.middle.appendChild(this.el)
    this.onParamsChange(params)
  }

  public async onParamsChange(_?: Record<string,string>) {
    console.log('onParamsChange')
    console.log(this.timelineManager.statuses)
    if (this.timelineManager.statuses.length === 0) {
      const st = await this.timelineManager.loadStatuses()
      this.statusesList?.addStatuses(st)
    }
    else
      this.statusesList?.addStatuses(this.timelineManager.statuses)
  }
}

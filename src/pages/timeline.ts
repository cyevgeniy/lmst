import { LStatusesList } from '../components/LStatusesList'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { div, h } from '../utils/dom'
import { Page } from '../utils/page.ts'
import type { IPage } from '../utils/page'
import type { StatusManager, TimelineManager } from '../appManager.ts'
import type { Mediator } from '../types/shared'

interface TimelineConstructorParams {
  tm: TimelineManager
  pm: Mediator
  sm: StatusManager
}

export class TimelinePage extends Page implements IPage {
  private el: HTMLElement
  private timelineContainer: HTMLElement
  private loadMoreBtn: LLoadMoreBtn
  private statusesList: LStatusesList

  private timelineManager: TimelineManager

  constructor(opts: TimelineConstructorParams) {
    super(opts.pm)

    this.timelineManager = opts.tm

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadMore() })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el])

    const statusesListEl = h('div')
    this.statusesList = new LStatusesList({
      root:statusesListEl,
      statuses:[],
      sm: opts.sm
    })

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

    // For the home timeline, we want to cache already loaded timeline,
    // so that when the user returns to it, he can scroll from
    // the previous position
    !this.timelineManager.rendered && this.timelineManager.clearStatuses()
    this.layout.middle.appendChild(this.el)

    // Load statuses only on initial mount
    // After mount, statuses are loaded only by 'Load more'
    // button click
    !this.timelineManager.rendered && this.onParamsChange(params)
    this.timelineManager.rendered = true
  }

  /**
   * Later we should cache fetched timeline and merge it with new
   * timeline after we navigate from the 'compose' page
   */
  public async onParamsChange(_?: Record<string,string>) {
    await this.loadMore()
  }
}

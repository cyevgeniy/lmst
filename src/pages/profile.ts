import { IPage, Page } from '../utils/page'
import type { Mediator } from '../types/shared'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { h, div } from '../utils/dom'
import { ProfileTimelineManager, StatusManager } from '../appManager'

interface ProfilePageConstructorParams {
  pm: ProfileTimelineManager
  pageMediator: Mediator
  sm: StatusManager
}


export class ProfilePage extends Page implements IPage {
  private el: HTMLElement
  private statusesList: LStatusesList
  private profileHeaderComponent: LProfileHeader
  private profileId: string
  private loadMoreBtn: LLoadMoreBtn

  private profileManager: ProfileTimelineManager

  constructor(opts: ProfilePageConstructorParams) {
    super(opts.pageMediator)
  //  this.pageMediator = pageMediator
    this.profileManager = opts.pm
    this.profileId = ''

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadStatuses() })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el])

    const timelineContainer = div('timeline-container', [])
    this.statusesList = new LStatusesList({
      root: timelineContainer,
      statuses: [],
      sm: opts.sm
    })

    timelineContainer.appendChild(loadMoreBtnContainer)

    this.el = h('div', {attrs: {id: 'timeline-root'}})//, [profileHeader, timelineContainer, loadMoreBtn])
    this.profileHeaderComponent = new LProfileHeader(this.el)
    this.el.appendChild(timelineContainer)
    this.el.appendChild(loadMoreBtnContainer)

  }

  public mount(params?: Record<string, string>) {
    super.mount()
    this.layout.middle.innerHTML = ''
    this.layout.middle.appendChild(this.el)
    this.onParamsChange(params)
  }

  private async loadStatuses() {
    if (!this.profileId)
      return

    // xxx: check for errors here or in profileManager and return an
    // empty array?
    this.loadMoreBtn.loading = true
    const statuses = await this.profileManager.loadStatuses()
    this.loadMoreBtn.loading = false
    this.statusesList.addStatuses(statuses)
  }

  public onParamsChange(params?: Record<string, string>) {
    this.profileId = params?.id ?? ''
    this.profileManager.profileId = this.profileId
    this.profileManager.getAccount().then(resp => this.profileHeaderComponent.update(resp))
    this.loadStatuses()
  }
}

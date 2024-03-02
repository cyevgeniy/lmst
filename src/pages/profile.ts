import { IPage, Page } from '../utils/page'
import type { Mediator } from '../types/shared'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { h, button, div } from '../utils/dom'
import { onClick } from '../utils/events'
import { ProfileTimelineManager } from '../appManager'

export class ProfilePage extends Page implements IPage {
  private el: HTMLElement
  private statusesList: LStatusesList
  private profileHeaderComponent: LProfileHeader
  private profileId: string
  private loadMoreBtn: HTMLButtonElement
//  private pageMediator: Mediator

  private profileManager: ProfileTimelineManager

  constructor(pm: ProfileTimelineManager, pageMediator: Mediator) {
    super(pageMediator)
  //  this.pageMediator = pageMediator
    this.profileManager = pm
    this.profileId = ''

    this.loadMoreBtn = button('timeline__load-more', 'Load more')
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn])
    onClick(this.loadMoreBtn, () => this.loadStatuses())
    // this.loadMoreBtn.addEventListener('click', () => this.loadStatuses())

    const timelineContainer = div('timeline-container', [])
    this.statusesList = new LStatusesList(timelineContainer, [])
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

    const statuses = await this.profileManager.loadStatuses()
    this.statusesList.addStatuses(statuses)
  }

  public onParamsChange(params?: Record<string, string>) {
    this.profileId = params?.id ?? ''
    this.profileManager.profileId = this.profileId
    this.profileManager.getAccount().then(resp => this.profileHeaderComponent.update(resp))
    this.loadStatuses()
  }
}

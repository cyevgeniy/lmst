import { IPage, Page } from '../utils/page'
import { LStatusesList } from '../components/LStatusesList'
import { LProfileHeader } from '../components/ProfileHeader'
import { h, button, div } from '../utils/dom'
import { ProfileTimelineManager } from '../appManager'

export class ProfilePage extends Page implements IPage {
  private el: HTMLElement
  private statusesList: LStatusesList
  private profileHeaderComponent: LProfileHeader
  private profileId: string

  private profileManager: ProfileTimelineManager

  constructor(pm: ProfileTimelineManager) {
    super()
    this.profileManager = pm
    this.profileId = ''

    const loadMoreBtn = button('timeline__load-more', 'Load more')
    loadMoreBtn.addEventListener('click', () => this.loadStatuses())

    const timelineContainer = div('timeline-container', [])
    this.statusesList = new LStatusesList(timelineContainer, [])
    timelineContainer.appendChild(loadMoreBtn)

    this.el = h('div', {attrs: {id: 'timeline-root'}})//, [profileHeader, timelineContainer, loadMoreBtn])
    this.profileHeaderComponent = new LProfileHeader(this.el)
    this.el.appendChild(timelineContainer)
    this.el.appendChild(loadMoreBtn)

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

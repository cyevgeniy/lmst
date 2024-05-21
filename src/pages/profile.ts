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
  private noMoreDataText: HTMLDivElement

  private profileManager: ProfileTimelineManager

  constructor(opts: ProfilePageConstructorParams) {
    super(opts.pageMediator)
  //  this.pageMediator = pageMediator
    this.profileManager = opts.pm
    this.profileId = ''

    this.noMoreDataText = h('div', {class: 'timelime-no-more-rows'}, 'No more records')
    this.noMoreDataText.style.display = 'none'

    this.loadMoreBtn = new LLoadMoreBtn({text: 'Load more', onClick: () => this.loadStatuses() })
    const loadMoreBtnContainer = div('timeline__load-more-container', [this.loadMoreBtn.el, this.noMoreDataText])

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
    //this.el.appendChild(this.loadMoreBtnContainer)
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

    if (this.profileManager.noMoreData) {
      this.noMoreDataText.style.display = 'block'
      this.loadMoreBtn.visible = false
    } else {
      this.noMoreDataText.style.display = 'none'
      this.loadMoreBtn.visible = true
    }

    this.loadMoreBtn.loading = false
    this.statusesList.addStatuses(statuses)
  }

  // Creates a 'not found' message
  private createNotFound(webfinger: string) {
    this.el.replaceChildren(
      h('div', {
        class: 'profile__notfound'},
        `Account ${webfinger} was not found`
       )
    )
  }

  public async onParamsChange(params?: Record<string, string>) {
    const webfinger = params?.webfinger ?? ''

    this.profileManager.profileWebfinger = webfinger


    try {
      const resp = await this.profileManager.getAccount()
      this.profileId = resp.id
      this.profileHeaderComponent.update(resp)
    }
    catch(e: unknown) {
      this.createNotFound(webfinger)
      console.error(e)
    }

    await this.loadStatuses()
  }
}

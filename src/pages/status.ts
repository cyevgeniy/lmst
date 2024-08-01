import { IPage, Page } from '../utils/page'
import { div } from '../utils/dom'
import { Status } from '../types/shared'
import { AppManager } from '../appManager'
import { LStatus } from '../components/LStatus'
import { LStatusesList } from '../components/LStatusesList'

export class StatusPage extends Page implements IPage {

    private el: HTMLDivElement
    private status: Status | undefined
    private statusesList: LStatusesList
    private statusRoot: HTMLDivElement
    private descendantsRoot: HTMLDivElement
    private appManager: AppManager
    private server: string
    private statusId: string

    constructor(appManager: AppManager) {
        super(appManager.globalMediator)
        this.appManager = appManager
        this.status = undefined
        this.descendantsRoot = div('status-descendants') as HTMLDivElement
        this.statusesList = new LStatusesList({
            sm: appManager.statusManager,
            root: this.descendantsRoot,
            statuses: [],
        })
        this.statusRoot = div('status-root')
        this.el = div('', [this.statusRoot, this.descendantsRoot]) as HTMLDivElement
        this.server = ''
        this.statusId = ''
    }

    private async loadStatus() {
        const resp = await this.appManager.statusManager.getStatus(this.statusId, {server: this.server})
        this.status = resp.ok ? resp.value : undefined

        this.renderStatus()
    }

    private async loadDescendants() {
        this.statusesList.clearStatuses()

        const res = await this.appManager.statusManager.getStatusContext(this.statusId, {server: this.server})
        if (res.ok)
            this.statusesList.addStatuses(res.value.descendants)
    }

    private renderStatus() {
        if (this.status) {
            const st = new LStatus({status: this.status, clickableContent: false, singleView: true})
            this.statusRoot.appendChild(st.el)
        } else {
            this.statusRoot.innerText = 'No status'
        }
    }

    public mount (params?: Record<string, string>) {
        super.mount()
        this.layout.middle.innerHTML = ''
		this.statusRoot.innerHTML = ''
        this.layout.middle.appendChild(this.el)
        this.onParamsChange(params)
    }

    public async onParamsChange(params?: Record<string, string>) {
        this.statusId = params?.id ?? ''
        this.server = `https://${params?.server ?? ''}`

        await this.loadStatus()
        await this.loadDescendants()
      }

}

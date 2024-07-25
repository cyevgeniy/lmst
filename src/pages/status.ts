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
        this.statusRoot = div('status-root') as HTMLDivElement
        this.el = div('', [this.statusRoot, this.descendantsRoot]) as HTMLDivElement
        
    }

    private async loadStatus(id: Status['id']) {
        const resp = await this.appManager.statusManager.getStatus(id)
        if (resp.ok)
            this.status = resp.value
        else
            this.status = undefined

        this.renderStatus()
    }

    private async loadDescendants(id: Status['id']) {
        this.statusesList.clearStatuses()

        const res = await this.appManager.statusManager.getStatusContext(id)
        if (res.ok)
            this.statusesList.addStatuses(res.value.descendants)
    }

    private renderStatus() {
        if (this.status) {
            const st = new LStatus({status: this.status})
            this.statusRoot.appendChild(st.el)
        } else {
            this.statusRoot.innerText = 'No status'
        }
    }

    public mount (params?: Record<string, string>) {
        super.mount()
        this.layout.middle.innerHTML = ''
        this.layout.middle.appendChild(this.el)
        this.onParamsChange(params)
    }

    public async onParamsChange(params?: Record<string, string>) {
        const statusId = params?.id ?? ''
    
        await this.loadStatus(statusId)
        await this.loadDescendants(statusId)
      }

}
import { IPage, Page } from '../utils/page'
import { h, div, hide, show } from '../utils/dom'
import { Status } from '../types/shared'
import { AppManager } from '../appManager'
import { LStatus } from '../components/LStatus'

export class StatusPage extends Page implements IPage {

    private el: HTMLDivElement
    private status: Status | undefined
    private appManager: AppManager

    constructor(appManager: AppManager) {
        super(appManager.globalMediator)
        this.appManager = appManager
        this.status = undefined
        this.el = div('status') as HTMLDivElement
    }

    private async loadStatus(id: Status['id']) {
        const resp = await this.appManager.statusManager.getStatus(id)
        if (resp.ok)
            this.status = resp.value
        else
            this.status = undefined

        this.renderStatus()
    }

    private renderStatus() {
        if (this.status) {
            const st = new LStatus({status: this.status})
            this.el.appendChild(st.el)
        } else {
            this.el.innerText = 'No status'
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
      }

}
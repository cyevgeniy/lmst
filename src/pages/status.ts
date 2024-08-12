import { div } from '../utils/dom'
import { Status } from '../types/shared'
import { AppManager } from '../appManager'
import { LStatus } from '../components/LStatus'
import { LStatusesList } from '../components/LStatusesList'

export function createStatusPage(
  root: HTMLElement,
  appManager: AppManager,
  params?: Record<string, string>
) {
  const statusId = params?.id ?? ''
  const server = `https://${params?.server ?? ''}`

  root.innerHTML = ''

  let status: Status | undefined = undefined

  const descendantsRoot = div('status-descendants')
  const statusesList = LStatusesList({
      sm: appManager.statusManager,
      root: descendantsRoot,
      statuses: [],
  })
  const statusRoot = div('')
  const el = div('', [statusRoot, descendantsRoot])

  root.appendChild(el)

  async function loadStatus() {
    const resp = await appManager.statusManager.getStatus(statusId, {server: server})
    status = resp.ok ? resp.value : undefined

    renderStatus()
}

    async function loadDescendants() {
      statusesList.clearStatuses()

      const res = await appManager.statusManager.getStatusContext(statusId, {server: server})
      if (res.ok)
        statusesList.addStatuses(res.value.descendants)
    }

  function renderStatus() {
    if (status) {
        const st = LStatus({status: status, clickableContent: false, singleView: true})
        statusRoot.appendChild(st.el)
    } else {
        statusRoot.innerText = 'No status'
    }
  }

  loadStatus().then(loadDescendants)

  return {
    el,
  }
}

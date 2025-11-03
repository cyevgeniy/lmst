import { childs, div, h, hide, show } from '../utils/dom'
import { on } from '../utils/signal'
import { user } from '../utils/user'
import { Status } from '../types/shared'
import { AppManager } from '../appManager'
import { LStatus } from '../components/LStatus'
import { LStatusesList } from '../components/LStatusesList'
import { LButton } from '../components/LButton'
import { LFilePicker } from '../components/LFilePicker'
import { LPreview } from '../components/LPreview'
import { useCompose } from '../store/composeStore'

export function createStatusPage(
  root: HTMLElement,
  appManager: AppManager,
  params?: Record<string, string>,
) {
  let statusId = params?.id ?? '',
    server = `https://${params?.server ?? ''}`

  root.innerHTML = ''

  let status: Status | undefined = undefined,
    descendantsRoot = div('status-descendants'),
    statusesList = LStatusesList({
      sm: appManager.statusManager,
      root: descendantsRoot,
      statuses: [],
    }),
    statusRoot = div(''),
    replyToStatus = h('div', {
      className: 'compose-wrapper',
    }),
    el = div('', [statusRoot, replyToStatus, descendantsRoot])

  childs(root, [el])

  let { text, postAvailable, cleanup, files } = useCompose()

  let postReply: ReturnType<typeof LButton>,
    filePicker: ReturnType<typeof LFilePicker>,
    replyTextArea: HTMLTextAreaElement,
    preview: ReturnType<typeof LPreview>,
    cleanText = on(text, (newValue) => (replyTextArea.value = newValue)),
    cleanDisabled = on(
      postAvailable,
      (newValue) => (postReply.disabled = !newValue),
    ),
    onUnmount = () => {
      cleanup()
      cleanDisabled()
      cleanText()
    },
    onInput = (e: Event) => {
      const area = e.target as HTMLTextAreaElement
      text(area.value)
    }

  async function addReplyBlock() {
    if (!user.isLoaded()) return

    replyTextArea = h('textarea', {
      attrs: {
        maxLength: '300',
        rows: '3',
        placeholder: 'Your reply',
        spellcheck: 'false',
      },
      onInput,
    })

    postReply = LButton({
      text: 'Post',
      onClick: async () => {
        if (!text() || !status) return

        postAvailable(false)
        const res = await appManager.statusManager.postStatus({
          statusText: `@${status.account.acct} ${replyTextArea.value}`,
          files: files(),
          in_reply_to_id: statusId,
        })
        postAvailable(true)

        if (res.ok) {
          statusesList.addStatuses([res.value])
          text('')
          filePicker.clear()
        } else {
          alert(res.error)
        }
      },
      className: 'compose__button',
    })

    postReply.disabled = !postAvailable()

    filePicker = LFilePicker(files)

    preview = LPreview(files)

    childs(replyToStatus, [
      replyTextArea,
      div('compose__post', [filePicker.el, postReply.el]),
      preview.el,
    ])
  }

  on(user.user, (_) => {
    if (!user.isLoaded()) hide(replyToStatus)
    else show(replyToStatus)
  })

  async function loadStatus() {
    const resp = await appManager.statusManager.getStatus(statusId, {
      server: server,
    })
    status = resp.ok ? resp.value : undefined

    renderStatus()
  }

  async function loadDescendants() {
    statusesList.clearStatuses()

    const res = await appManager.statusManager.getStatusContext(statusId, {
      server: server,
    })
    if (res.ok) statusesList.addStatuses(res.value.descendants)
  }

  function renderStatus() {
    if (status) {
      const st = LStatus({
        status: status,
        singleView: true,
      })
      childs(statusRoot, [st])
    } else {
      statusRoot.innerText = 'No status'
    }
  }

  loadStatus().then(loadDescendants).then(addReplyBlock)

  return {
    el,
    onUnmount,
  }
}

import { childs, div, h, hide, show } from '../utils/dom'
import { on } from '../utils/signal'
import { user } from '../utils/user'
import { Status } from '../types/shared'
import { AppManager } from '../appManager'
import { LStatus } from '../components/LStatus'
import { LStatusesList } from '../components/LStatusesList'
import { LButton } from '../components/LButton'
import { useCompose } from '../store/composeStore'

export function createStatusPage(
  root: HTMLElement,
  appManager: AppManager,
  params?: Record<string, string>
) {
  const statusId = params?.id ?? ''
  const server = `https://${params?.server ?? ''}`

  root.innerHTML = ''

  let status: Status | undefined = undefined,

  descendantsRoot = div('status-descendants'),
  statusesList = LStatusesList({
    sm: appManager.statusManager,
    root: descendantsRoot,
    statuses: [],
  }),

  statusRoot = div(''),

  replyToStatus = h(
    'div',
    {
      className: 'reply'
    }
  ),

  el = div('', [statusRoot, replyToStatus, descendantsRoot])

  root.appendChild(el)

  const { text, postAvailable, cleanup } = useCompose()

  let postReply: ReturnType<typeof LButton>
  let replyTextArea: HTMLTextAreaElement

  let cleanText = on(text, newValue => replyTextArea.value = newValue),
  cleanDisabled = on(postAvailable, newValue => postReply.disabled = !newValue),

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

    await user.verifyCredentials()

    if (!user.isLoaded())
      return

    replyTextArea = h('textarea', {
      attrs: {
        maxLength: '300',
        rows: '3',
        placeholder: 'Your reply'
      },
      onInput,
    })

    postReply = LButton({
      text: 'Post', onClick: async () => {
        if (!text()) return

        const res = await appManager.statusManager.postStatus({
          statusText: replyTextArea.value,
          in_reply_to_id: statusId
        })

        if (res.ok) {
          statusesList.addStatuses([res.value])
          text('')
        }
        else {
          alert(res.error)
        }
      }
    })

    postReply.disabled = !postAvailable()

    childs(replyToStatus, [replyTextArea, div('reply-buttonContainer', [postReply.el])])
  }



  on(user.user, _ => {
    if (!user.isLoaded())
      hide(replyToStatus)
    else
      show(replyToStatus)
  })

  async function loadStatus() {
    const resp = await appManager.statusManager.getStatus(statusId, { server: server })
    status = resp.ok ? resp.value : undefined

    renderStatus()
  }

  async function loadDescendants() {
    statusesList.clearStatuses()

    const res = await appManager.statusManager.getStatusContext(statusId, { server: server })
    if (res.ok)
      statusesList.addStatuses(res.value.descendants)
  }

  function renderStatus() {
    if (status) {
      const st = LStatus({ status: status, clickableContent: false, singleView: true })
      statusRoot.appendChild(st.el)
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

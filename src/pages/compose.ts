import { childs, getIcon, h } from '../utils/dom'
import { LButton } from '../components/LButton'
import { LComposeZen } from '../components/LComposeZen'
import { LFilePicker } from '../components/LFilePicker'
import { LPreview } from '../components/LPreview'
import { text, postAvailable, files } from '../store/composeStore'
import { on } from '../utils/signal'
import { postStatus } from '../core/status'

export function createComposePage(root: HTMLElement) {
  root.innerHTML = ''

  let textArea = h('textarea', {
    attrs: {
      maxLength: '300',
      rows: '10',
      placeholder: "What's on your mind?",
      spellcheck: 'false',
    },
    onInput,
  })

  // Display current text in the text area
  textArea.value = text()

  let cleanText = on(text, (newValue) => (textArea.value = newValue)),
    cleanDisabled = on(postAvailable, (newValue) => (btn.disabled = !newValue)),
    btn = LButton({
      text: 'Post',
      className: 'compose__button',
      onClick: onPostClick,
    }),
    sensitiveCheckbox = h('input', {
      attrs: { type: 'checkbox', id: 'sensitive' },
    }),
    sensitive = h('div', null, [
      sensitiveCheckbox,
      h('label', { attrs: { for: 'sensitive' } }, 'sensitive content'),
    ]),
    filePicker = LFilePicker(files),
    zenModeBtn = h('button', {
      className: ['icon-button', 'ml-auto', 'compose-toolbar__zen'],
      innerHTML: getIcon('icon-fullscreen'),
      onClick: showZen,
    }),
    textToolbar = h('div', { className: 'compose-toolbar' }, [zenModeBtn]),
    preview = LPreview(files),
    composeZen: ReturnType<typeof LComposeZen>

  btn.disabled = !postAvailable()

  function onUnmount() {
    cleanText()
    cleanDisabled()
    preview.cleanImages()
  }

  function onComposeZenClose() {
    text(composeZen!.text)
    composeZen!.el.remove()
    textArea.focus()
  }

  function showZen() {
    composeZen = LComposeZen({
      onClose: () => onComposeZenClose(),
      text: text(),
    })
    childs(el, [composeZen])
    composeZen.setFocus()
  }

  async function onPostClick() {
    postAvailable(false)

    let res = await postStatus({
      statusText: text(),
      files: files(),
      sensitive: sensitiveCheckbox.checked,
    })

    postAvailable(true)

    if (res.ok) {
      text('')
      // It will also sync empty array with `files` signal
      filePicker.clear()
      sensitiveCheckbox.checked = false
    } else {
      alert(res.error)
    }
  }

  function onInput(e: Event) {
    let area = e.target as HTMLTextAreaElement
    text(area.value)
  }

  let el = h('div', { className: 'compose__wrapper' }, [
    textToolbar,
    sensitive,
    textArea,
    h('div', { className: 'compose__post' }, [filePicker.el, btn.el]),
    preview.el,
  ])

  childs(root, [el])
  textArea.focus()

  return {
    onUnmount,
  }
}

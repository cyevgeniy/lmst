import { childs, getIcon, h } from '../utils/dom'
import type { AppManager } from '../appManager'
import { LButton } from '../components/LButton'
import { LComposeZen } from '../components/LComposeZen'
import { text, postAvailable } from '../store/composeStore'
import { on } from '../utils/signal'

export function createComposePage(root: HTMLElement, appManager: AppManager) {
  root.innerHTML = ''

  let textArea = h('textarea', {
    attrs: {
      maxLength: '300',
      rows: '10',
      placeholder: 'What\'s on your mind?'
    },
    onInput,
  })

  // Display current text in the text area
  textArea.value = text()

  let cleanText = on(text, newValue => textArea.value = newValue),
  cleanDisabled = on(postAvailable, newValue => btn.disabled = !newValue),
  btn = LButton({text: 'Post', className: 'compose__button', onClick: onPostClick}),
  zenModeBtn = h(
    'button',
    {
      className: ['icon-button', 'ml-auto', 'compose-toolbar__zen'],
      innerHTML: getIcon('icon-fullscreen'),
      onClick: showZen,
    }
  ),

  textToolbar = h('div', {className: 'compose-toolbar'}, [zenModeBtn]),

  composeZen: ReturnType<typeof LComposeZen>

  let t = h('div')
  t.innerHTML = `<input type="file" multiple>`
  let mediaBtn = t.firstElementChild as HTMLElement
  console.log(mediaBtn)

  btn.disabled = !postAvailable()

  function onUnmount() {
    cleanText()
    cleanDisabled()
  }

  function onComposeZenClose() {
    text(composeZen!.text)
    composeZen!.el.remove()
    textArea.focus()
  }

  function showZen() {
    composeZen = LComposeZen({onClose: () => onComposeZenClose(), text: text()})
    childs(el, [composeZen])
    composeZen.setFocus()
  }

  async function onPostClick() {
    let files: File[] = []

    // @ts-expect-error this is a `<input type="file">`, it has `files` attribute
    for (const f of mediaBtn.files) {
      files.push(f)
    }
    const res = await appManager.statusManager.postStatus({statusText: text(), files})

    if (res.ok)
      text('')
    else
      alert(res.error)
  }

  function onInput(e: Event) {
    const area = e.target as HTMLTextAreaElement
    text(area.value)
  }

  const el = h(
     'div',
     { className: 'compose__wrapper' },
     [
        textToolbar,
        textArea,
        h('div', { className: 'compose__post'}, [btn.el, mediaBtn]),
  ])

  root.appendChild(el)
  textArea.focus()

  return {
    onUnmount,
  }
}

import { childs, h } from '../utils/dom'
import type { AppManager } from '../appManager'
import { LButton } from '../components/LButton'
import { LComposeZen } from '../components/LComposeZen'
import { fullScreen } from '../components/Icons'

export function createComposePage(root: HTMLElement, appManager: AppManager) {
  root.innerHTML = ''
  const text = h('textarea', {
    attrs: {
      maxLength: '300',
      rows: '10',
      placeholder: 'What\'s on your mind?'
    },
    onInput,
  })

  const btn = LButton({text: 'Post', className: 'compose__button', onClick: onPostClick})
  const zenModeBtn = h(
    'button',
    {
      className: ['icon-button', 'ml-auto', 'compose-toolbar__zen'],
      innerHTML: fullScreen,
      onClick: showZen,
    }
  )

  const textToolbar = h('div', {className: 'compose-toolbar'}, [zenModeBtn])

  let composeZen: ReturnType<typeof LComposeZen>

  function setBtnStatus(area: HTMLTextAreaElement) {
    btn.disabled = area.value.length === 0
  }

  function onComposeZenClose() {
    const msg = composeZen!.text
    text.value = msg
    setBtnStatus(text)
    composeZen!.el.remove()
  }

  function showZen() {
    composeZen = LComposeZen({onClose: () => onComposeZenClose(), text: text.value})
    childs(el, [composeZen])
    composeZen.setFocus()
  }

  // By default the text in the
  setBtnStatus(text)

  async function onPostClick() {
    try {
      await appManager.statusManager.postStatus({statusText: text.value})
      text.value = ''
    } catch (e: unknown) {
      // show error to the user
      if (e instanceof Error)
        alert(e.message)
    }
  }

  function onInput(e: Event) {
    const area = e.target as HTMLTextAreaElement
    setBtnStatus(area)
  }

  const el = h(
     'div',
     { className: 'compose__wrapper' },
     [
        textToolbar,
        text,
        h('div', { className: 'compose__post'}, [btn.el]),
  ])

  root.appendChild(el)
  text.focus()
}

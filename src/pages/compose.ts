import { onClick } from '../utils/events'
import { h } from '../utils/dom'
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

  const btn = new LButton('Post', ['compose__button'])
  const zenModeBtn = h('button',{class: ['icon-button', 'ml-auto', 'compose-toolbar__zen'], innerHTML: fullScreen})

  const textToolbar = h('div', {class: 'compose-toolbar'}, [zenModeBtn])

  let composeZen: LComposeZen

  function setBtnStatus(area: HTMLTextAreaElement) {
    btn.disabled = area.value.length === 0
  }

  function onComposeZenClose() {
    const msg = composeZen!.getText()
    text.value = msg
    setBtnStatus(text)
    composeZen!.el.remove()
  }

  function showZen() {
    composeZen = new LComposeZen(el)
    composeZen.setText(text.value)
    composeZen.onClose(() => onComposeZenClose())
  }

  // By default the text in the
  setBtnStatus(text)

  onClick(zenModeBtn, () => showZen())

  btn.onClick = async () => {
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
     { class: 'compose__wrapper' },
     [
        textToolbar,
        text,
        h('div', { class: 'compose__post'}, [btn.el]),
  ])

  root.appendChild(el)
  text.focus()
}

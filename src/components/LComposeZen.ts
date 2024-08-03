import { childs, div, h } from '../utils/dom'
import { exitFullScreen } from '../components/Icons'

export interface ComposeZenProps {
  text?: string
  onClose: () => void
}

export function LComposeZen(props: ComposeZenProps) {
  const { onClose = () => {}} = props
  const btn = h('button',{className: ['icon-button', 'compose-zen__button'], innerHTML: exitFullScreen, onClick: onClose})
  const el = div('compose-zen')
  const wrapper = div('compose-zen-wrapper')
  const textarea = h('textarea', {
    className: 'compose-zen__textarea',
    attrs: {
      placeholder: 'What is on your mind?'
    },
    onKeyup,
  })
  props.text && (textarea.value = props.text)

  function setFocus() {
    textarea.focus()
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.key === 'Escape')
      onClose() 
  }

  childs(wrapper, [textarea, btn])
  
  el.appendChild(wrapper)

  return {
    el,
    get text() {
      return textarea.value
    },
    set text(t: string) {
      textarea.value = t
    },
    setFocus,
  }
}
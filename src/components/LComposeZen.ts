import { childs, div, getIcon, h } from '../utils/dom'

export interface ComposeZenProps {
  text?: string
  onClose: () => void
}

export function LComposeZen(props: ComposeZenProps) {
  let { onClose = () => {}} = props
  let btn = h('button',{className: ['icon-button', 'compose-zen__button'], innerHTML: getIcon('icon-exitFullScreen'), onClick: onClose}),
  el = div('compose-zen'),
  wrapper = div('compose-zen-wrapper'),
  textarea = h('textarea', {
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

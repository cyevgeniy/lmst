import { childs, div, getIcon, h } from '../utils/dom'
import { noop } from '../utils/shared'

export interface ComposeZenProps {
  text?: string
  onClose: () => void
}

export function LComposeZen(props: ComposeZenProps) {
  let { onClose = noop } = props
  let btn = h('button', {
      className: ['icon-button', 'zenButton'],
      innerHTML: getIcon('icon-exitFullScreen'),
      onClick: onClose,
    }),
    el = div('zen'),
    wrapper = div('zenWrapper'),
    textarea = h('textarea', {
      className: 'zenTextarea',
      attrs: {
        placeholder: 'What is on your mind?',
      },
      onKeyup,
    })

  props.text && (textarea.value = props.text)

  function setFocus() {
    textarea.focus()
  }

  function onKeyup(e: KeyboardEvent) {
    if (e.key === 'Escape') onClose()
  }

  childs(wrapper, [textarea, btn])

  childs(el, [wrapper])

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

import { h } from '../utils/dom'
import type { NodeProps, HTMLEventHandler } from '../utils/dom'

const DISABLED_CLASS = 'disabled'

export type ButtonProps = {
  text: string
} & Pick<NodeProps, 'className'> &
  HTMLEventHandler

export function LButton(props: ButtonProps) {
  let { text, ...restProps } = props
  let el = h('button', restProps, text)
  el.classList.add('button')

  return {
    el,
    set text(v: string) {
      el.innerText = v
    },

    get disabled() {
      return el.disabled
    },

    set disabled(v: boolean) {
      el.disabled = v

      if (v) el.classList.add(DISABLED_CLASS)
      else el.classList.remove(DISABLED_CLASS)
    },
  }
}

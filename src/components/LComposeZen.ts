import { div, h } from '../utils/dom'
import { onClick } from '../utils/events'
import { exitFullScreen } from '../components/Icons'

export class LComposeZen {
  public readonly el: HTMLElement
  private textarea: HTMLTextAreaElement
  private btn: HTMLButtonElement
  private onCloseCb: () => void

  constructor(root: HTMLElement) {
    this.btn = h('button',{class: ['icon-button', 'compose-zen__button'], innerHTML: exitFullScreen})
    this.el = div('compose-zen')
    const wrapper = div('compose-zen-wrapper')
    this.textarea = h('textarea', {
      class: 'compose-zen__textarea',
      attrs: {
        placeholder: 'What is on your mind?'
      }
    })

    wrapper.appendChild(this.textarea)
    wrapper.appendChild(this.btn)
    this.el.appendChild(wrapper)
    root.appendChild(this.el)
    this.setFocus()
    this.onCloseCb = () => {}
    onClick(this.btn, () => this.onCloseCb())

    this.textarea.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape')
	this.onCloseCb()
    })
  }

  public getText() {
    return this.textarea.value
  }

  public setText(t: string) {
    this.textarea.value = t
  }

  public setFocus() {
    this.textarea.focus()
  }

  public onClose(cb: () => void) {
    this.onCloseCb = cb
  }
}

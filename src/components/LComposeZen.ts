import { div, h } from '../utils/dom'
import { LButton } from './LButton'
import { onClick } from '../utils/events'

export class LComposeZen {
  public readonly el: HTMLElement
  private textarea: HTMLTextAreaElement
  private btn: LButton
  private onCloseCb: () => void

  constructor(root: HTMLElement) {
    this.btn = new LButton('Post', ['compose-zen__button'])
    this.el = div('compose-zen')
    const wrapper = div('compose-zen-wrapper')
    this.textarea = h('textarea', {
      class: 'compose-zen__textarea',
      attrs: {
        placeholder: 'What is on your mind?'
      }
    })

    wrapper.appendChild(this.textarea)
    wrapper.appendChild(this.btn.el)
    this.el.appendChild(wrapper)
    root.appendChild(this.el)
    this.setFocus()
    this.onCloseCb = () => {}
    onClick(this.btn.el, () => this.onCloseCb())
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

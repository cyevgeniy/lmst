import { div, h } from '../utils/dom'
import { LButton } from './LButton'

export class LComposeZen {
  private el: HTMLElement
  private textarea: HTMLTextAreaElement
  private btn: LButton

  constructor(root: HTMLElement) {
    this.btn = new LButton('Post', 'compose-zen__button')
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
  }

  public getText() {
    return this.textarea.value
  }

  public setFocus() {
    this.textarea.focus()
  }
}

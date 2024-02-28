import { Page } from '../utils/page'
import type { IPage } from '../utils/page'
import { h } from '../utils/dom'
import { useAppConfig } from '../appConfig'
import { User } from '../utils/user'
import type { StatusManager } from '../appManager'


export class ComposePage extends Page implements IPage {
  private el: HTMLElement
  private text: HTMLTextAreaElement
  private btn: HTMLElement

  private statusManager: StatusManager
  
  constructor(statusManager: StatusManager) {
    super()
    this.statusManager = statusManager

    this.text = h('textarea', {attrs: {maxLength: '300', rows: '10', autofocus: 'true', placeholder: 'What\'s on your mind?'}, class: 'compose__text'}) as HTMLTextAreaElement
    this.btn = h('button', {class: 'compose__post'}, 'Post')

    this.btn.addEventListener('click', async () => {
      try {
        await this.statusManager.postStatus({statusText: this.text.value})
        this.text.value = ''
      } catch (e: unknown) {
        // show error to the user
        if (e instanceof Error)
          console.log(e.message)
      }
    })

    this.el = h('div', null, [this.text, this.btn])
  }

  public mount() {
    super.mount()
    this.layout.middle.appendChild(this.el)
  }
}
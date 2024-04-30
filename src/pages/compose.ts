import { Page } from '../utils/page'
import type { IPage } from '../utils/page'
import { h } from '../utils/dom'
import type { StatusManager, AppManager } from '../appManager'


export class ComposePage extends Page implements IPage {
  private el: HTMLElement
  private text: HTMLTextAreaElement
  private btn: HTMLButtonElement

  private statusManager: StatusManager

  constructor(appManager: AppManager) {
    super(appManager.globalMediator)
    this.statusManager = appManager.statusManager

    this.text = h('textarea', {
      attrs: {
        maxLength: '300',
        rows: '10',
        autofocus: 'true',
        placeholder: 'What\'s on your mind?'
      },
      class: 'compose__text'
    }) as HTMLTextAreaElement

    this.btn = h('button', {class: ['compose__post', 'button'], attrs: {disabled: 'true'}}, 'Post') as HTMLButtonElement

    this.btn.addEventListener('click', async () => {
      try {
        await this.statusManager.postStatus({statusText: this.text.value})
        this.text.value = ''
      } catch (e: unknown) {
        // show error to the user
        if (e instanceof Error)
          alert(e.message)
      }
    })

    this.text.addEventListener('input', (e) => {
      const area = e.target as HTMLTextAreaElement
      this.btn.disabled = area.value.length === 0
    })

    this.el = h(
      'div',
      null,
      [
        this.text,
        h('div', null, [this.btn]),
      ])
  }

  public mount() {
    super.mount()
    this.layout.middle.appendChild(this.el)
  }
}

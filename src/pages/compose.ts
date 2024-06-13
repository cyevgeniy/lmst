import { Page } from '../utils/page'
import type { IPage } from '../utils/page'
import { h } from '../utils/dom'
import type { StatusManager, AppManager } from '../appManager'
import { LButton } from '../components/LButton'
import { LComposeZen } from '../components/LComposeZen'

export class ComposePage extends Page implements IPage {
  private el: HTMLElement
  private text: HTMLTextAreaElement
  private btn: LButton
  private statusManager: StatusManager
  private composeZen: LComposeZen

  constructor(appManager: AppManager) {
    super(appManager.globalMediator)
    this.statusManager = appManager.statusManager

    this.text = h('textarea', {
      attrs: {
        maxLength: '300',
        rows: '10',
        placeholder: 'What\'s on your mind?'
      },
      class: 'compose__text'
    }) as HTMLTextAreaElement

    this.btn = new LButton('Post', ['compose__button'])
    // By default the text in the
    this.setBtnStatus(this.text)

    this.btn.onClick = async () => {
      try {
        await this.statusManager.postStatus({statusText: this.text.value})
        this.text.value = ''
      } catch (e: unknown) {
        // show error to the user
        if (e instanceof Error)
          alert(e.message)
      }
    }

    this.text.addEventListener('input', (e) => {
      const area = e.target as HTMLTextAreaElement
      this.setBtnStatus(area)
    })

    // this.el = h(
    //   'div',
    //   { class: 'compose__wrapper' },
    //   [
    //     this.text,
    //     h('div', { class: 'compose__post'}, [this.btn.el]),
    //   ])
    this.el = h('div')
    this.composeZen = new LComposeZen(this.el)
  }

  private setBtnStatus(area: HTMLTextAreaElement) {
    this.btn.disabled = area.value.length === 0
  }

  public mount() {
    super.mount()
    this.layout.middle.appendChild(this.el)
    this.text.focus()
    this.composeZen.setFocus()
  }
}

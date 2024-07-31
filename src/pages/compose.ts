import { Page } from '../utils/page'
import type { IPage } from '../utils/page'
import { onClick } from '../utils/events'
import { h } from '../utils/dom'
import type { StatusManager, AppManager } from '../appManager'
import { LButton } from '../components/LButton'
import { LComposeZen } from '../components/LComposeZen'
import { fullScreen } from '../components/Icons'

export class ComposePage extends Page implements IPage {
  private el: HTMLElement
  private textToolbar: HTMLDivElement
  private text: HTMLTextAreaElement
  private btn: LButton
  private zenModeBtn: HTMLButtonElement
  private statusManager: StatusManager
  private composeZen?: LComposeZen

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
    this.zenModeBtn = h('button',{class: ['icon-button', 'ml-auto', 'compose-toolbar__zen'], innerHTML: fullScreen})

    this.textToolbar = h('div', {class: 'compose-toolbar'}, [this.zenModeBtn])
    // By default the text in the
    this.setBtnStatus(this.text)

    onClick(this.zenModeBtn, () => this.showZen())

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

     this.el = h(
       'div',
       { class: 'compose__wrapper' },
       [
	 this.textToolbar,
         this.text,
         h('div', { class: 'compose__post'}, [this.btn.el]),
       ])
  }

  private showZen() {
    this.composeZen = new LComposeZen(this.el)
    this.composeZen.setText(this.text.value)
    this.composeZen.onClose(() => this.onComposeZenClose())
  }

  private onComposeZenClose() {
    const text = this.composeZen!.getText()
    this.text.value = text
    this.setBtnStatus(this.text)
    this.composeZen!.el.remove()

  }

  private setBtnStatus(area: HTMLTextAreaElement) {
    this.btn.disabled = area.value.length === 0
  }

  public mount() {
    super.mount()
    this.layout.middle.appendChild(this.el)
    this.text.focus()
  }
}

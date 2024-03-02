import { h } from '../utils/dom'
import type { Status } from '../types/shared.d.ts'

export class LStatusButtons {
  // @ts-ignore
  private readonly status: Status
  private bookmarkBtn: HTMLButtonElement
  private boostBtn: HTMLButtonElement
  private boostCb: (() => void) | undefined
  private bookmarkCb: (() => void) | undefined
  public el: HTMLElement
  

  constructor(status: Status) {
    this.status = status
    this.bookmarkBtn = h('button', {class: 'status__bookmark'}, 'Bookmark') 
    this.boostBtn = h('button', {class: 'status__boost'}, 'Boost')
    this.el = h('div', {
      class: 'status__buttons' },
      [
        this.bookmarkBtn,
        this.boostBtn
      ])

    this.boostCb = undefined
    this.bookmarkCb = undefined

    this.addEventListeners()
  }

  private addEventListeners() {
    this.boostBtn.addEventListener('click', () => {
      this.boostCb && this.boostCb()
    })

    this.bookmarkBtn.addEventListener('click', () => {
      this.bookmarkCb && this.bookmarkCb()
    })
  }

  public onBoostClick(fn: () => void) {
    this.boostCb = fn
  }

  public onBookmarkClick(fn: () => void) {
    this.bookmarkCb = fn
  }
}

import { button } from '../utils/dom'
import { onClick } from '../utils/events'

export class LLoadMoreBtn {
  public el: HTMLButtonElement
  private _loading: boolean
  private text: string
  private cb?: (() => void)

  constructor(opts: {
    text: string
    onClick?: () => void
  }) {
    this.el = button('timeline__load-more', 'Load more')
    this._loading = false
    this.text = opts.text
    this.cb = opts.onClick
    onClick(this.el, () => this._onClick())
  }

  set loading(v: boolean) {
    if (this._loading === v)
      return

    this._loading = v

    if (v) {
      this.el.classList.add('button--disabled')
      this.el.innerText = 'Loading...'
    } else {
      this.el.classList.remove('button--disabled')
      this.el.innerText = this.text
    }
  }

  private _onClick() {
    if (this._loading)
      return

    this.cb?.()
  }
}

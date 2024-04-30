import { LButton } from './LButton'

export class LLoadMoreBtn {
  private btn: LButton
  //public el: HTMLButtonElement
  private _loading: boolean
  private text: string
  private cb?: (() => void)

  constructor(opts: {
    text: string
    onClick?: () => void
  }) {
    this.btn = new LButton('Load more', ['timeline__load-more'])
    this._loading = false
    this.text = opts.text
    this.cb = opts.onClick
    this.btn.onClick =  () => this._onClick()
  }

  get el() {
    return this.btn.el
  }

  set loading(v: boolean) {
    if (this._loading === v)
      return

    this._loading = v
    this.btn.disabled = v

    if (v) {
      this.btn.text = 'Loading...'
    } else {
      this.btn.text = this.text
    }
  }

  private _onClick() {
    if (this._loading)
      return

    this.cb?.()
  }
}

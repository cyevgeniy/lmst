import { LButton } from './LButton'

export class LLoadMoreBtn {
  private btn: ReturnType<typeof LButton>
  //public el: HTMLButtonElement
  private _loading: boolean
  private text: string
  private cb?: (() => void)

  constructor(opts: {
    text: string
    onClick?: () => void
  }) {
    this.btn = LButton({
      text: 'Load more',
      className: ['timeline__load-more'],
      onClick: () => this.onClick()
    })
    this._loading = false
    this.text = opts.text
    this.cb = opts.onClick
  }

  get el() {
    return this.btn.el
  }

  set visible(v: boolean) {
    this.btn.el.style.display = v ? 'block' : 'none'
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

  private onClick() {
    if (this._loading)
      return

    this.cb?.()
  }
}

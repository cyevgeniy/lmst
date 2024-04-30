import { h } from "../utils/dom"

const DISABLED_CLASS = 'button--disabled'

export class LButton {
	public readonly el: HTMLButtonElement
	private _onClick: () => void

	constructor(text: string, className: string[] = []) {
    this._onClick = () => {}

    this.el = h('button', {class: ['button', ...className]}, text) as HTMLButtonElement
    this.addClickListener()

	}

  set text(v: string) {
    this.el.innerText = v
  }

  get disabled() {
    return this.el.disabled
  }

  set disabled(v: boolean) {
    this.el.disabled = v

    console.log('set disabled status = ', v)

    if (v)
      this.el.classList.add(DISABLED_CLASS)
    else
      this.el.classList.remove(DISABLED_CLASS)
  }

  get onClick() {
    return this._onClick
  }

  set onClick(cb: () => void) {
    this._onClick = cb
  }

  private addClickListener() {
    this.el.addEventListener('click', () => this._onClick())
  }
}
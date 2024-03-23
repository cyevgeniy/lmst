import { h } from '../utils/dom'
import type { Status } from '../types/shared.d.ts'
import { boost } from './Icons.ts'
import { onClick } from '../utils/events'

export class LStatusButtons {
  // @ts-ignore
  private readonly status: Status
  private boostBtn: HTMLButtonElement
  private boostCb: (() => void) | undefined
  private actionsEnabled: boolean
  public el: HTMLElement

  constructor(opts: {
    status: Status
    actionsEnabled: boolean
  }) {
    this.status = opts.status
    this.actionsEnabled = opts.actionsEnabled
    this.boostBtn = h('button', {class: 'status__boost', innerHTML: boost})
    this.el = h('div', {
      class: 'status__buttons' },
      [
        this.actionsEnabled ? this.boostBtn : undefined
      ])

    this.boostCb = undefined

    this.addEventListeners()
  }

  private addEventListeners() {
    onClick(this.boostBtn, () => {
     this.actionsEnabled && this.boostCb && this.boostCb()
    })
  }

  public onBoostClick(fn: () => void) {
    this.boostCb = fn
  }
}

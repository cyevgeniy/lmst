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
    this.status = opts.status.reblog ?? opts.status
    this.actionsEnabled = opts.actionsEnabled
    const classes: string[] = ['status__boost']
    if (this.status.reblogged)
      classes.push('status__boost--boosted')
    this.boostBtn = h('button', {class: classes, innerHTML: boost})
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
      if (this.actionsEnabled && this.boostCb) {
        this.boostCb()

        // Toggle boosted class
        if (!this.status.reblogged)
          this.boostBtn.classList.add('status__boost--boosted')
        else
          this.boostBtn.classList.remove('status__boost--boosted')

        this.status.reblogged !== undefined && (this.status.reblogged = !this.status.reblogged)
      }
    })
  }

  public onBoostClick(fn: () => void) {
    this.boostCb = fn
  }
}

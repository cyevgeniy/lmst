import { h } from '../utils/dom'
import type { Status } from '../types/shared.d.ts'
import { boost, deleteIcon } from './Icons.ts'
import { onClick } from '../utils/events'

type OnBoostCallback = (boosted: boolean) => void
type OnDeleteCallback = (status: Status) => void

export interface ActionPermissions {
  canBoost?: Boolean
  canDelete?: boolean
}


export class LStatusButtons {
  // @ts-ignore
  private readonly status: Status
  private boostBtn: HTMLButtonElement
  private deleteBtn: HTMLButtonElement
  private boostCb: OnBoostCallback | undefined
  private deleteCb: OnDeleteCallback | undefined
  private permissions: ActionPermissions
  public el: HTMLElement

  constructor(opts: {
    status: Status
    permissions: ActionPermissions
  }) {
    this.status = opts.status.reblog ?? opts.status
    this.permissions = opts.permissions
    const classes: string[] = ['status-button']
    if (this.status.reblogged)
      classes.push('status-button--boosted')
    this.boostBtn = h('button', {class: classes, innerHTML: boost})
    this.deleteBtn = h('button', {class: ['status-button', 'status-button__delete'], innerHTML: deleteIcon})
    this.el = h('div', {
      class: 'status__buttons' },
      [
        this.permissions.canBoost ? this.boostBtn : undefined,
        this.permissions.canDelete ? this.deleteBtn : undefined,
      ])

    this.boostCb = undefined

    this.addEventListeners()
  }

  private addEventListeners() {
    onClick(this.boostBtn, () => {
      if (this.permissions.canBoost) {

        if (this.boostCb) {
          this.boostCb(!this.status.reblogged)
        }

        // Toggle boosted class
        if (!this.status.reblogged)
          this.boostBtn.classList.add('status-button--boosted')
        else
          this.boostBtn.classList.remove('status-button--boosted')

        this.status.reblogged !== undefined && (this.status.reblogged = !this.status.reblogged)
      }
    })

    onClick(this.deleteBtn, () => {
      if (!this.permissions.canDelete)
        return

      this.deleteCb && this.deleteCb(this.status)
    })
  }

  public onBoostClick(fn: OnBoostCallback) {
    this.boostCb = fn
  }

  public onDeleteClick(fn: OnDeleteCallback) {
    this.deleteCb = fn
  }
}

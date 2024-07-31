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
  private boostBtn: HTMLButtonElement | undefined
  private deleteBtn: HTMLButtonElement | undefined
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


    this.createButtons()

    this.el = h('div', {
      class: 'status__buttons' },
      [
        this.boostBtn,
        this.deleteBtn,
      ])

    this.boostCb = undefined

    this.addEventListeners()
  }

  private createBoostBtn() {
    const classes: string[] = ['icon-button', 'status-button']
    if (this.status.reblogged)
      classes.push('status-button--boosted')

    return h('button', {class: classes, innerHTML: boost})
  }

  private createDeleteBtn() {
    return h('button', {class: ['icon-button', 'status-button', 'ml-auto'], innerHTML: deleteIcon})
  }

  private createButtons() {
    this.permissions.canBoost && (this.boostBtn = this.createBoostBtn())
    this.permissions.canDelete && (this.deleteBtn = this.createDeleteBtn())
  }

  private addEventListeners() {
    this.boostBtn &&  onClick(this.boostBtn, () => {
        if (this.boostCb) {
          this.boostCb(!this.status.reblogged)
        }

        // Toggle boosted class
        if (!this.status.reblogged)
          this.boostBtn?.classList.add('status-button--boosted')
        else
          this.boostBtn?.classList.remove('status-button--boosted')

        this.status.reblogged !== undefined && (this.status.reblogged = !this.status.reblogged)
    })

    this.deleteBtn && onClick(this.deleteBtn, () => {
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

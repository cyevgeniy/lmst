import { h } from '../utils/dom'

export class LAvatar {
  public el: HTMLElement

  constructor(img?: string, size: 'md' | 'lg' = 'md') {
    this.el = h('img', {class: ['avatar', size === 'md' ? 'avatar--md' : 'avatar--lg'], attrs: {src: `${img ?? 'assets/img/no-avatar.webp'}` }})
  }

  /**
   * Update avatar's image
   */
  updateImage(img?: string) {
    this.el.setAttribute('src', img ?? 'assets/img/no-avatar.webp')
  }
}

import { h } from '../utils/dom'

export class LAvatar {
  public el: HTMLElement

  constructor(img: string, size: 'md' | 'lg' = 'md') {
    this.el = h('img', {className: ['avatar', size === 'md' ? 'avatar--md' : 'avatar--lg'], attrs: {src: img }})
  }

  /**
   * Update avatar's image
   */
  updateImage(img?: string) {
    // clear image on empty avatar url
    this.el.setAttribute('src', img ?? '')
  }
}

import { h } from '../utils/dom'

export class LAvatar {
  public el: HTMLElement

  constructor(img?: string) {
    this.el = h('img', {class: 'avatar', attrs: {src: `${img ?? 'assets/img/no-avatar.webp'}` }})   
  }

  onImageClick(cb: () => void) {
    this.el.addEventListener('click', cb)
  }

  /**
   * Update avatar's image
   */
  updateImage(img?: string) {
    this.el.setAttribute('src', img ?? 'assets/img/no-avatar.webp')
  }
}

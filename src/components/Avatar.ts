import { h } from '../utils/dom'

export function Avatar(img?: string) {
  let avatar: HTMLElement

  function mount() {
    avatar =     h('img', {class: 'avatar', attrs: {src: `${img ?? 'assets/img/no-avatar.webp'}` }})
    return avatar
  }

  /**
   * Update avatar's image
   */
  function update(img?: string) {
    avatar.setAttribute('src', img ?? 'assets/img/no-avatar.webp')
  }

  return {
    mount,
    update,
  }

}

import {h, div, span } from '../utils/dom'

export function LNav(root: HTMLElement) {
  let el: HTMLElement

  function mount() {
    el = div('nav', [
      h('a', {attrs: {href: '/'}}, [
        h('span', {attrs: {id: 'logo'}}, 'Lmst')
      ] )
    ])

    root.appendChild(el)

    return el
  }

  return {
    mount,
  }
}
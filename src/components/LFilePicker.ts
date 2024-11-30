import { getIcon, h, show, hide } from '../utils/dom'
import type { Signal } from '../utils/signal'

export function LFilePicker(files: Signal<File[]>) {
  let t = h('div')

  t.innerHTML = `<input type="file" class="filepicker-input" accept="image/*" multiple>`
  let input = t.firstElementChild as HTMLInputElement,

  clear = () => {
    input.value = ''
    // we don't use `files([])`, because then we need to cleanup somehow, it's just more crappy code to write
    input.dispatchEvent(new Event('change'))
  },
  clearSpan = h('span', {innerHTML: 'Clear files', onClick: clear }),
  btn = h('button', {innerHTML: getIcon('icon-paperclip'), onClick: () => input.click()})

  hide(clearSpan)

  input.addEventListener('change', () => {
    // @ts-expext-error it has
    let a = Array.from(input.files ?? [])
    files(a)
    if (a.length)
      show(clearSpan)
    else
      hide(clearSpan)
  })

  let el = h('div', { className: 'filepicker'}, [btn, input, clearSpan])

  return {
    el,
    clear
  }
}

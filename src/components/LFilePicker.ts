import { getIcon, h } from '../utils/dom'
import type { Signal } from '../utils/signal'

export function LFilePicker(files: Signal<File[]>) {
	let t = h('div'),
  icon = getIcon('icon-paperclip')

  t.innerHTML = `<input type="file" class="filepicker-input" multiple>`
	let input = t.firstElementChild as HTMLInputElement

  input.addEventListener('change', () => {
    // @ts-expext-error it has
    files(Array.from(input.files ?? []))
  })

  let el = h('div', { className: 'filepicker', innerHTML: icon, onClick: () => {input.click()} }, [input])

	return {
    el
	}
}
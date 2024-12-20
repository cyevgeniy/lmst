import { div, h } from '../utils/dom'
import { on } from '../utils/signal.ts'
import type { Signal } from '../utils/signal.ts'

export function LPreview(files: Signal<File[]>) {
  let el = div('compose-preview'),
  cleanImages = on(files, newValue => {
    // Free memory for previously displayed images
    for (const t of el.children) {
      if (t.tagName.toLowerCase() === 'img')
        // @ts-expect-error we added these images, they always have sources
        URL.revokeObjectURL(t.getAttribute('src'))
    }

    el.innerHTML = ''

    for (const file of newValue) {
      let src = URL.createObjectURL(file),
      img = h('img', {attrs: { src}})

      el.appendChild(img)
    }
  })

  return {
    el,
    cleanImages,
  }

}

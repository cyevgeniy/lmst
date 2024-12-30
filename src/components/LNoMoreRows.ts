import { h } from '../utils/dom.ts'

export function LNoMoreRows(text: string = 'No more records') {
   return h('div', {className: 'timelime-no-more-rows'}, text)
}

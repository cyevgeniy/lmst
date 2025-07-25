import { h } from '../utils/dom.ts'

export let LNoMoreRows = (text: string = 'No more records') =>
  h('div', { className: 'no-more-rows' }, text)

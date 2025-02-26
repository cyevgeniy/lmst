import { h } from '../utils/dom.ts'

export let LNoMoreRows = (text: string = 'No more records') =>
  h('div', { className: 'timelime-no-more-rows' }, text)

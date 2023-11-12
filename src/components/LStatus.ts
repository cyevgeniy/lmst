import type { Status } from '../types/shared'
import { h } from '../utils/dom'
import { lRouter } from '../router'

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

export function LStatus(status: Status) {
  const avatar =     h('img', {class: 'avatar', attrs: {src: `${status.account?.avatar ?? 'assets/img/no-avatar.webp'}` }})
  const el = h('div', {class: 'status'}, [
    h('div', {class: 'status__header'}, [
      avatar,
      h('span', null, `${status.account?.display_name || ''}`),
      h('span', {class: 'status__create-date'}, `${ fmtDate(status.created_at) ?? ''}`),
    ]),
    h('div', {innerHTML: status.content})
  ])

  avatar.addEventListener('click', () => {
    lRouter.navigateTo(`/profile/${status.id}`)
  })

  return { el }
}

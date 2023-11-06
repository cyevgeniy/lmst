import type { Status } from '../types/shared'

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}

export function LStatus(status: Status) {
  const el = document.createElement('div')
  el.classList.add('status')

  el.innerHTML = `<div class="status__header">
    <img src="${status.account?.avatar ?? 'assets/img/no-avatar.webp'}" class="avatar">
    <span>${status.account?.display_name || ''}</span>
    <span class="status__create-date"> ${ fmtDate(status.created_at) ?? ''} </span>
  </div>`

  const content = document.createElement('div')
  content.innerHTML = status.content
  el.appendChild(content)

  return { el }
}

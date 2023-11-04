import type { Account } from '../types/shared'

export interface Post {
  /**
   * Post's content in raw html
   */
  content: string

  /**
   * Post date
   */
  created_at: string

  account: Account
}

function fmtDate(d: string) {
  return d.substring(0, d.indexOf('T'))
}


export function LPost(post: Post) {
  const el = document.createElement('div')
  el.classList.add('post')

  // const { el: avatar } = LAvatar(post.account?.avatar)
  el.innerHTML = `<div class="post__header">
    <img src="${post.account?.avatar ?? 'assets/img/no-avatar.webp'}" class="avatar">
    <span>${post.account?.display_name || ''}</span>
    <span class="post__create-date"> ${ fmtDate(post.created_at) ?? ''} </span>
  </div>`

  const content = document.createElement('div')
  content.innerHTML = post.content
  el.appendChild(content)

  return { el }
}

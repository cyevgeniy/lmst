export interface Post {
  /**
   * Post's content in raw html
   */
  content: string

  /**
   * Post date
   */
  created_at: string
}


export function LPost(post: Post) {
  const el = document.createElement('div')
  el.classList.add('post')
  const content = document.createElement('div')
  content.innerHTML = post.content
  el.appendChild(content)

  return { el }
}

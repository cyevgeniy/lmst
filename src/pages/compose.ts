import { definePage } from '../utils/page'
import { h } from '../utils/dom'
import { useAppConfig } from '../appConfig'
import { User } from '../utils/user'

export const composePage = definePage(() => {

  let el: HTMLElement
  let text: HTMLTextAreaElement
  let btn: HTMLElement
  const appConfig = useAppConfig()
  const user = new User()

  async function postStatus() {
    const statusText = text.value
    user.loadTokenFromStore()

    const params = new FormData()
    params.append('status', statusText)

    try {
      const resp = await fetch(`${appConfig.server}/api/v1/statuses`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${user.accessToken()}`,
        },
        body: params,
      })
      if (resp.status === 200) {
        alert('Posted!')
        text.value = ''
      }

    } catch(e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  function mount() {
    text = h('textarea', {attrs: {maxLength: '300', rows: '10', autofocus: 'true', placeholder: 'What\'s on your mind?'}, class: 'compose__text'}) as HTMLTextAreaElement
    btn = h('button', {class: 'compose__post'}, 'Post')

    btn.addEventListener('click', () => {
      postStatus()
    })

    el = h('div', null, [text, btn])

    return el
  }

  return { mount }
})

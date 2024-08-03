import { HTMLEventHandler, h } from '../utils/dom'

export type AvatarProps = {
  img: string
  size?: 'md' | 'lg'
} & HTMLEventHandler

export function LAvatar(props: AvatarProps) {
  const { img, size = 'md', ...handlers } = props
  const el = h(
    'img',
    {
      className: ['avatar', size === 'md' ? 'avatar--md' : 'avatar--lg'],
      attrs: {src: img },
      ...handlers
    }
  )

  return {
    el,
    set img(v: string) {
      el.setAttribute('src', v ?? '')
    }
  }
}


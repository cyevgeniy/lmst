import { HTMLEventHandler } from '../utils/dom'
import { LButton } from './LButton'

export interface LoadMoreBtnProps {
  text: string
}
export function LLoadMoreBtn(props: LoadMoreBtnProps & HTMLEventHandler) {
  const { text, onClick, ...handlers } = props

  let loading = false,

  btn = LButton({
    text: 'Load more',
    className: ['timeline__load-more'],
    ...handlers,
    onClick: _onClick,
  })

  function _onClick(e: MouseEvent) {
    !loading && onClick?.(e)
  }

  return {
    el: btn.el,

    set visible(v: boolean) {
      btn.el.style.display = v ? 'block' : 'none'
    },
    set loading(v: boolean) {
      if (loading === v)
        return

      loading = v
      btn.disabled = v

      if (v) {
        btn.text = 'Loading...'
      } else {
        btn.text = text
      }
    }
  }
}

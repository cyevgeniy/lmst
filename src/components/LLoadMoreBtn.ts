import { hide, HTMLEventHandler, show } from '../utils/dom'
import { LButton } from './LButton'

export interface LoadMoreBtnProps {
  text: string
}
export function LLoadMoreBtn(props: LoadMoreBtnProps & HTMLEventHandler) {
  const { text = 'Load more', onClick, ...handlers } = props

  let loading = false,
    btn = LButton({
      text,
      className: ['timeline__load-more'],
      ...handlers,
      onClick: _onClick,
    })

  function _onClick(e: PointerEvent) {
    !loading && onClick?.(e)
  }

  return {
    el: btn.el,

    set visible(v: boolean) {
      if (v) show(btn.el)
      else hide(btn.el)
    },
    set loading(v: boolean) {
      if (loading === v) return

      loading = btn.disabled = v
      btn.text = v ? `Loading...` : text
    },
  }
}

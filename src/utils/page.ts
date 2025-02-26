import { LInfo } from '../components/LInfo'
import { createLayout } from '../components/Layout'
import type { GlobalNavigation } from '../types/shared'
import { childs, ElLike } from './dom'

export interface Page extends ElLike {
  onUnmount?: () => void
  onMount?: () => void
}

export function createMainPage(gn: GlobalNavigation) {
  let root = document.getElementById('app')

  if (!root) throw new Error('Unable to locate application root element')

  let layout = createLayout(root, gn)
  childs(layout.right, [LInfo()])

  return {
    root,
    ...layout,
  }
}

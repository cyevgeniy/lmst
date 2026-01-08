import { LInfo } from '../components/LInfo'
import { createLayout } from '../components/Layout'
import { childs, ElLike } from './dom'

export interface Page extends ElLike {
  onUnmount?: () => void
  onMount?: () => void
}

export function createMainPage() {
  let root = document.getElementById('app')

  if (!root) throw new Error('Unable to locate application root element')

  let layout = createLayout(root)
  childs(layout.right, [LInfo()])

  return {
    root,
    ...layout,
  }
}

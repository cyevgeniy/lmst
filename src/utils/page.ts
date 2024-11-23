import { LInfo } from "../components/LInfo"
import { createLayout } from "../components/Layout"
import type { GlobalNavigation } from '../types/shared'
import { childs, ElLike } from "./dom"

export interface Page extends ElLike {
  onUnmount?: () => void
  onMount?: () => void
}

export function createMainPage(gn: GlobalNavigation) {
  const root = document.getElementById('app')

  if (!root)
    throw new Error('Unable to locate application root element')

  let layout= createLayout(root, gn)
  childs(layout.right, [LInfo()])

  function clearPage() {
    root && (root.innerHTML = '')
  }

  return {
    root,
    ...layout,
    clearPage,
  }
}

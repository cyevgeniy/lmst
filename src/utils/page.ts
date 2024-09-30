import { LInfo } from "../components/LInfo"
import { createLayout } from "../components/Layout"
import type { Mediator } from '../types/shared'
import { childs, ElLike } from "./dom"

export interface Page extends ElLike {
  onUnmount?: () => void
  onMount?: () => void
}

export function createMainPage(pm: Mediator) {
  const root = document.getElementById('app')

  if (!root)
    throw new Error('Unable to locate application root element')

  let layout= createLayout(root, pm)
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

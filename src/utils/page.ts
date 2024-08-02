import { LInfo } from "../components/LInfo"
import { createLayout } from "../components/Layout"
import type { Mediator } from '../types/shared'

export interface Page {
  mount: (params?: Record<string, string>) => void
}

export function createMainPage(pm: Mediator) {
  const root = document.getElementById('app')

  if (!root)
    throw new Error('Unable to locate application root element')

  let layout= createLayout(root, pm)
  new LInfo(layout.right)

  function clearPage() {
    root && (root.innerHTML = '')
  }

  return {
    root,
    ...layout,
    clearPage,
  }
}

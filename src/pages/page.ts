export type PageConstructor = () => {render: () => HTMLElement, onMount?: () => void}

export interface PageInstance {
  mount: () => void
}

export function Page(p: PageConstructor): PageInstance {
  function mount() {
  	// Find root node
  	const root = document.getElementById('app')

  	if (!root)
  	  return

    const page = p()
    root.innerHTML = ''
    root.appendChild(page.render())
    page.onMount?.()
  }

  return {
    mount,
  }
}

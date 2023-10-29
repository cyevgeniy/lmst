export function Button(title: string) {
	const el = document.createElement('button')

	el.appendChild(document.createTextNode(title))
	el.classList.add('super-class')
	return { el }
}
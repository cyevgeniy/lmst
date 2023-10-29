import { Button } from "./Button"

export function HelloWorld() {
	const el = document.createElement('div')
	const content = document.createTextNode("Hello, world")
	el.appendChild(content)

	const { el: btn } = Button('Hello, world')
	el.appendChild(btn)

	return {el}
}
import { div } from "../utils/dom";
import { LNav } from "./LNav";

export function Layout(root: HTMLElement) {
  const middle = div('layout__middle')
  const right = div('layout__right')
  const footer = div('layout__footer')
  
  LNav(root).mount()

  root.appendChild(div('layout__container', [
    middle,
    right,
  ]))

  root.appendChild(footer)



  return {
    middle,
    right,
    footer,
  }
}
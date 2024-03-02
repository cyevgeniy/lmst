export function onClick<T extends HTMLElement>(el: T, fn: (e: MouseEvent) => void) {
  el.addEventListener('click', fn)
}

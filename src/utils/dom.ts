export interface NodeProps {
  className?: string | string[]
  innerHTML?: string
  attrs?: Record<string, string>
}

// Normalizes T | T[] to T[]
function toArray<T>(p: T | T[] | null | undefined): T[] {
  return p
    ? Array.isArray(p)
      ? p
      : [p]
    : []
}

/**
 * This function is something like `h` function in Vue, but much simpler
 * It's just a convenient way to create Html elements and apply styles and
 * attributes to them.
 *
 * Examples:
 *
 *    const el = h('div') // Create div element
 *    const el = h('div', {className: 'avatar'}) // Create div element with 'avatar' className
 *    const el = h('div', {className: ['avatar', 'rounded']}) // Create div element with 'avatar' and 'rounded' classes
 *    const el = h('img', {attrs: { src: 'https://domain.com/pic.webp' } }) // Create image with src attribute
 *    const el = h('div', null, [h('div', {className: 'header'})]) // <div><div class="header"></div>
 *
 *    If the last parameter is a string, it becomes `textContent` of the element:
 *    const el = h('span', null, 'User: Alex') // <span>User:Alex</span>
 *
 *    Use `innerHtml` field of the second parameter to set `innerHTML` directly:
 *    const el = h('div', {innerHtml: `<div class="header"> HEAD </div>`}) //<div>`<div class="header"> HEAD </div></div>

 */
type TagName = keyof HTMLElementTagNameMap
export type HTMLEventHandler = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]? : (evt: HTMLElementEventMap[K]) => void
}
export function h<T extends TagName>(
  nodeName: T,
  props?: NodeProps & HTMLEventHandler | null,
  childs?: Array<HTMLElement | undefined> | string
) {
  const el = document.createElement<T>(nodeName)

  // class shouldn't be an empty string, so filter them
  const _className = toArray(props?.className).filter(Boolean)

  _className && el.classList.add(..._className)

  for (const k in props) {
    if (k.startsWith('on')) {
      const evt = k.slice(2).toLowerCase()
      // @ts-expect-error We know that props[k] will be a valid event handler
      el.addEventListener(evt, props[k])
    }
  }

  if (props?.attrs) {
    for (const attr in props.attrs)
      el.setAttribute(attr, props.attrs[attr])
  }

  props?.innerHTML && (el.innerHTML = props.innerHTML)

  if (childs) {
    if (Array.isArray(childs))
      childs.forEach(child => {
        child && el.appendChild(child)
      })
    else if (typeof childs === 'string')
      el.textContent = childs
  }

  return el
}

export let div = (className: string | string[], childs: Array<HTMLElement | undefined> = []) => h('div', {className }, childs)

export let span = (className: string | string[], text: string): HTMLElement => h('span', {className }, text)

export let a = (className: string | string[], href: string, text: string) => h('a', { className, attrs: { href, target: '_blank'}}, text)

export let hide = (el: HTMLElement) => el.style.display = 'none'

export let show =(el: HTMLElement) => el.style.display = ''

export function useCommonEl<T extends HTMLElement>(el: T) {
  function _show() {
    show(el)
  }

  function _hide() {
    hide(el)
  }

  function setText(t: string) {
    el.innerText = t
  }

  return {
    show: _show,
    hide: _hide,
    setText,
  }
}

export interface ElLike<T extends HTMLElement = HTMLElement> {
  el: T
}

function isElLike<T extends HTMLElement>(v: T | ElLike<T>): v is ElLike<T> {
  return 'el' in v
}

/**
 * Appends childs to the specified element
 * Each of elements can be a 'native' html element,
 * or 'ElLike' object - an object that has an 'el' field, which is
 * html element node.
 * @param el Root element
 * @param childs A list of nodes to append to the root
 */
export function childs<T extends HTMLElement, K extends HTMLElement>(
  el: T | ElLike<T>,
  childs: (K | ElLike<K>)[]
): void {
  let _el = isElLike(el) ? el.el : el
  childs.forEach(c => {
    if (isElLike(c))
      _el.appendChild(c.el)
    else
      _el.appendChild(c)
  })
}

let icons = new Map<string, string>()

// Returns innerHTML by id.
// If there's no element with provided id, returns empty string.
export function getIcon(id: string): string {
  let i = icons.get(id)
  if (!i)
    icons.set(id, i = document.getElementById(id)?.innerHTML ?? '')

  return i
}

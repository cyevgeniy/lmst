export interface NodeProps {
  class?: string | string[]
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
 *    const el = h('div', {class: 'avatar'}) // Create div element with 'avatar' class
 *    const el = h('div', {class: ['avatar', 'rounded']}) // Create div element with 'avatar' and 'rounded' classes
 *    const el = h('img', {attrs: { src: 'https://domain.com/pic.webp' } }) // Create image with src attribute
 *    const el = h('div', null, [h('div', {class: 'header'})]) // <div><div class="header"></div>
 *
 *    If the last parameter is a string, it becomes `textContent` of the element:
 *    const el = h('span', null, 'User: Alex') // <span>User:Alex</span>
 *
 *    Use `innerHtml` field of the second parameter to set `innerHTML` directly:
 *    const el = h('div', {innerHtml: `<div class="header"> HEAD </div>`}) //<div>`<div class="header"> HEAD </div></div>

 */
type TagName = keyof HTMLElementTagNameMap
type HTMLEventHandler = {
  [K in keyof HTMLElementEventMap as `on${Capitalize<K>}`]? : (evt: HTMLElementEventMap[K]) => void
}
export function h<T extends TagName>(
  nodeName: T,
  props?: NodeProps & HTMLEventHandler | null,
  childs?: Array<HTMLElement | undefined> | string
) {
  const el = document.createElement<T>(nodeName)

  // class shouldn't be an empty string, so filter them
  const _class = toArray(props?.class).filter(Boolean)

  _class && el.classList.add(..._class)

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

export function div(classname: string | string[], childs: Array<HTMLElement | undefined> = []) {
  return h('div', {class: classname }, childs)
}

export function span(classname: string | string[], text: string): HTMLElement {
  return h('span', {class: classname }, text)
}

export function a(classname: string | string[], href: string, text: string) {
  return h('a', { class: classname, attrs: { href, target: '_blank'}}, text)
}

export function button(classname: string | string[], text: string) {
  const classes = ['button']
  if (Array.isArray(classname))
    classes.push(...classname)
  // Ignore empty strings
  else if (classname)
    classes.push(classname)

  return h('button', {class: classes}, text)
}

export function hide(el: HTMLElement) {
  el.style.display = 'none'
}

export function show(el: HTMLElement) {
  el.style.display = ''
}

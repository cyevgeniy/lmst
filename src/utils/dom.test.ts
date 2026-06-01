import { JSDOM } from 'jsdom'
import { beforeEach, describe, expect, it } from 'vitest'
import { h } from './dom.ts'

beforeEach(() => {
  global.document = new JSDOM(`<html><body></body></html>`).window.document
})

describe('h', () => {
  it('supports a single parameter', () => {
    const el = h('div')

    expect(el.tagName).toBe('DIV')
  })

  it('supports a single string className', () => {
    const el = h('div', { className: 'test-class' })

    expect(el.classList.contains('test-class')).toBe(true)
  })

  it('supports an array of classes', () => {
    const classes = ['class1', 'class2']
    const el = h('div', { className: classes })

    expect([...el.classList]).toEqual(classes)
  })

  it('supports attributes', () => {
    const el = h('img', { attrs: { src: 'img.png' } })

    expect(el.getAttribute('src')).toBe('img.png')
  })

  it('supports child nodes', () => {
    const child1 = h('div', { className: 'child1' })
    const child2 = h('div', { className: 'child2' })

    const el = h('div', null, [child1, child2])

    expect(el.children.length).toBe(2)
    expect(el.children[0]).toBe(child1)
    expect(el.children[1]).toBe(child2)
  })

  it('supports event handlers', () => {
    let v = 0
    function inc() {
      v += 1
    }

    const el = h('div', { onClick: inc })
    el.click()

    expect(v).toBe(1)
  })
})

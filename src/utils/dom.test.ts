import t from 'tap'
import { JSDOM } from 'jsdom'
import { h } from './dom.ts'


t.beforeEach(() => {
  global.document = new JSDOM(`<html><body></body></html>`).window.document;
})


t.test('h with a single parameter', t => {

  const el = h('div')

  t.equal(el.tagName, 'DIV')
  t.end()
})

t.test('h with a single string className', t => {

  const el = h('div', {className:'test-class'})

  t.ok(el.classList.contains('test-class'))
  t.end()
})

t.test('h with an array of classes', t => {

  const classes = ['class1', 'class2']
  const el = h('div', {className:classes})

  t.same(el.classList, classes)
  t.end()
})

t.test('h with attributes', t => {

  const el = h('img', {attrs:{src: 'img.png'}})

  t.same(el.attributes, [{name: 'src', value: 'img.png'}])

  t.end()
})

t.test('h with childs', t => {
  const child1 = h('div', {className: 'child1'})
  const child2 = h('div', {className: 'child2'})

  const el = h('div', null, [child1, child2])

  t.equal(el.children.length, 2)
  t.equal(el.children[0], child1)
  t.equal(el.children[1], child2)

  t.end()
})

t.test('h with event handlers', t => {
  let v = 0
  function inc() {
    v += 1
  }

  const el = h('div', {onClick: inc})
  el.click()
  t.equal(v, 1)

  t.end()
})

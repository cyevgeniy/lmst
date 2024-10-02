import t from 'tap'
import { searchParams } from './url.ts'

t.test('searchParams works with simple strings', t => {
    let r = searchParams({name: 'evg', email: 'evg1'})

    t.equal(r, 'name=evg&email=evg1')
    t.end()
})

t.test('searchParams works with empty keys', t => {
    let r = searchParams({name: 'evg', email: ''})

    t.equal(r, 'name=evg')
    t.end()
})

t.test('searchParams works with empty keys (1)', t => {
    let r = searchParams({name: '', email: ''})

    t.equal(r, '')
    t.end()
})

t.test('searchParams works with multi-word params', t => {
    let r = searchParams({q: 'search query'})

    t.equal(r, `q=${encodeURIComponent('search query')}`)
    t.end()
})


t.test('searchParams works with empty objects', t => {
    let r = searchParams({})

    t.equal(r, '')
    t.end()
})
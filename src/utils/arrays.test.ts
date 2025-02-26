import t from 'tap'
import { last } from './arrays.ts'

t.test('last function works', (t) => {
  t.equal(last([1, 2, 3]), 3)
  t.equal(last([1]), 1)
  t.equal(last([]), undefined)

  t.end()
})

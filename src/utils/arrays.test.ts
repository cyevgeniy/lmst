import { describe, expect, it } from 'vitest'
import { last } from './arrays.ts'

describe('last', () => {
  it('returns the last item in an array', () => {
    expect(last([1, 2, 3])).toBe(3)
    expect(last([1])).toBe(1)
    expect(last([])).toBeUndefined()
  })
})

import { describe, expect, it } from 'vitest'
import { searchParams } from './url.ts'

describe('searchParams', () => {
  it('works with simple strings', () => {
    const r = searchParams({ name: 'evg', email: 'evg1' })

    expect(r).toBe('name=evg&email=evg1')
  })

  it('omits empty keys', () => {
    const r = searchParams({ name: 'evg', email: '' })

    expect(r).toBe('name=evg')
  })

  it('returns an empty string when every key is empty', () => {
    const r = searchParams({ name: '', email: '' })

    expect(r).toBe('')
  })

  it('encodes multi-word params', () => {
    const r = searchParams({ q: 'search query' })

    expect(r).toBe(`q=${encodeURIComponent('search query')}`)
  })

  it('works with empty objects', () => {
    const r = searchParams({})

    expect(r).toBe('')
  })
})

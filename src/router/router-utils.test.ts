import { describe, expect, it } from 'vitest'
import { sanitizePath, getPathParameters } from './router-utils.ts'

describe('sanitizePath', () => {
  it('normalizes leading and trailing slashes', () => {
    expect(sanitizePath('')).toBe('/')
    expect(sanitizePath('/')).toBe('/')
    expect(sanitizePath('////')).toBe('/')
    expect(sanitizePath('///profile')).toBe('/profile')
    expect(sanitizePath('///profile/')).toBe('/profile')
    expect(sanitizePath('///profile/12/')).toBe('/profile/12')
  })
})

describe('getPathParameters', () => {
  it('matches paths and extracts params', () => {
    expect(getPathParameters('/profile', '/profile')).toEqual({
      matched: true,
      params: undefined,
    })

    expect(getPathParameters('/profile/:id', '/profile')).toEqual({
      matched: false,
    })

    expect(getPathParameters('/profile/:id', '/profile/123')).toMatchObject({
      matched: true,
      params: { id: '123' },
    })

    expect(getPathParameters('/', '/')).toMatchObject({
      matched: true,
    })

    expect(getPathParameters('', '/')).toMatchObject({
      matched: true,
    })

    expect(getPathParameters('/:id', '/')).toMatchObject({
      matched: false,
    })

    expect(getPathParameters('/:name', '/john')).toMatchObject({
      matched: true,
      params: {
        name: 'john',
      },
    })

    expect(
      getPathParameters(
        '/profile/:id/questions/:questionId',
        '/profile/123/questions/13',
      ),
    ).toMatchObject({
      matched: true,
      params: {
        id: '123',
        questionId: '13',
      },
    })

    expect(getPathParameters('/profile/:id/', '/profile/13/')).toMatchObject({
      matched: true,
      params: {
        id: '13',
      },
    })

    expect(
      getPathParameters('/profile/:id/questions', '/profile/13/'),
    ).toMatchObject({
      matched: false,
    })
  })
})

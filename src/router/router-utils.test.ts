import t from 'tap'
import { sanitizePath, getPathParameters } from './router-utils.ts'

t.test('sanitizePath function', (t) => {
  t.equal(sanitizePath(''), '/')
  t.equal(sanitizePath('/'), '/')
  t.equal(sanitizePath('////'), '/')
  t.equal(sanitizePath('///profile'), '/profile')
  t.equal(sanitizePath('///profile/'), '/profile')
  t.equal(sanitizePath('///profile/12/'), '/profile/12')

  t.end()
})

t.test('getPathparameters works', (t) => {
  t.match(getPathParameters('/profile', '/profile'), {
    matched: true,
    params: undefined,
  })

  t.match(getPathParameters('/profile/:id', '/profile'), {
    matched: false,
    params: undefined,
  })

  t.match(getPathParameters('/profile/:id', '/profile/123'), {
    matched: true,
    params: { id: '123' },
  })

  t.match(getPathParameters('/', '/'), {
    matched: true,
  })

  t.match(getPathParameters('', '/'), {
    matched: true,
  })

  t.match(getPathParameters('/:id', '/'), {
    matched: false,
  })

  t.match(getPathParameters('/:name', '/john'), {
    matched: true,
    params: {
      name: 'john',
    },
  })

  t.match(
    getPathParameters(
      '/profile/:id/questions/:questionId',
      '/profile/123/questions/13',
    ),
    {
      matched: true,
      params: {
        id: '123',
        questionId: '13',
      },
    },
  )

  t.match(getPathParameters('/profile/:id/', '/profile/13/'), {
    matched: true,
    params: {
      id: '13',
    },
  })

  t.match(getPathParameters('/profile/:id/questions', '/profile/13/'), {
    matched: false,
  })

  t.end()
})

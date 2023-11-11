/**
 * Remove trailing slashes from the beginning and end of a string
 * Sanitized path always starts with '/'
 *
 * @param path Path string to sanitize
 * @returns sanitized string
 */
export function sanitizePath(path: string): string {
  const arr = path.split('/').filter(i => i !== '').join('/')

  return ['/', ...arr].join('')
}

// /path, /path: match, no parameters
// /path/:id /path/123, match, params: {id: '123'}
// /path/:id /path/123/logins not match, no parameters (undefined)
export interface MatchResult {
  matched: boolean
  params?: Record<string, string>
}

export function getPathParameters(routePath: string, path: string): MatchResult  {
  const _routePath = sanitizePath(routePath)
  const _path = sanitizePath(path)

  // TODO: Don't use filter, edge case is when
  //       our route path is '/:id' and current location is '/'.
  //
  //       In this case first array is ['', ':id'], and the second is '['', '']'.
  //       It leads to returning {matched: true, params: { id: ''}} situation.
  //       By using filter, we avoid such situation.
  const _pathS = _path.split('/').filter(i => i !== '')
  const _routePathS = _routePath.split('/').filter(i => i !== '')

  if (_pathS.length !== _routePathS.length)
    return { matched: false}
  const res: Record<string, string> = {}

  for (let i = 0; i < _routePathS.length; ++i) {

    if (_routePathS[i][0] !== ':') {
      if (_routePathS[i] !== _pathS[i])
        return { matched: false }
    }
    else {
      res[_routePathS[i].substring(1)] = _pathS[i]
    }
  }

  return {
    matched: true,
    params: Object.keys(res).length > 0 ? res : undefined // TODO: set params to undefined if res is an empty object
  }
}

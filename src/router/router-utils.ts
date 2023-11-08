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
export interface MathResult {
  matched: boolean
  params?: Record<string, string>
}

export function getPathParameters(routePath: string, path: string): MatchResult  {
  return {
    matched: true,
    params: undefined
  }
}

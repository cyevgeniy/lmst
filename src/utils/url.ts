export interface SearchParamsOptions {
  [k: string]: string
}

/**
 * Converts an object to a search parameters string
 *
 * For example:
 * ```
 * let a = {name: 'Test', age: '43' }
 *
 * // Prints 'name=Test&age=34'
 * console.log(searchParams(a))
 * ```
 * @param params Search parameters
 * @returns string that is ready to be passed as a search to a url
 */
export function searchParams(params: SearchParamsOptions): string {
  return Object.entries(params)
    .filter(([_, value]) => value)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join('&')
}

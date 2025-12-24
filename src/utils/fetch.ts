import { getToken } from '../core/user'

function $fetch(
  url: string,
  opts: RequestInit & { withCredentials?: boolean } = {},
): Promise<Response> {
  let { withCredentials, headers = {}, ...init } = opts

  if (withCredentials) {
    headers = {
      ...headers,
      Authorization: `Bearer ${getToken()?.access_token ?? ''}`,
    }
  }

  return fetch(url, { ...init, headers })
}

export async function fetchJson<T = any>(
  url: string,
  opts: RequestInit & { withCredentials?: boolean } = {},
): Promise<T> {
  let res = await $fetch(url, opts)

  if (res.ok) return await res.json()

  throw new Error(await res.text())
}

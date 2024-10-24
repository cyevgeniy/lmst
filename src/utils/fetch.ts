import { user } from "./user"

export function $fetch(
  url: string,
  opts: RequestInit & { withCredentials?: boolean} = {}
): Promise<Response> {
  let { withCredentials, headers = {},  ...init } = opts

  if (withCredentials) {
    user.loadTokenFromStore()

    headers = {
      ...headers,
      Authorization: `Bearer ${user.accessToken()}`
    }
  }

  return fetch(url, { ...init, headers } )
}

export async function fetchJson<T=any>(
  url: string,
  opts: RequestInit & { withCredentials?: boolean} = {}
): Promise<T> {
  let res = await $fetch(url, opts )

  if (res.ok)
    return await res.json()

  throw new Error(await res.text())
}



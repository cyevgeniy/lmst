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

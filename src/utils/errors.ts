export function toError(e: unknown): Error {
  if (e instanceof Error) return e

  let msg = ''

  try {
    msg = JSON.stringify(e)
  } catch {
    msg = 'Unknown error'
  }

  return new Error(msg)
}

export function logErr(e: unknown) {
  let m = toError(e).message
  console.error(m)

  return m
}

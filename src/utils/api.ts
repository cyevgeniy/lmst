export interface Failed {
  ok: false
  error: string
}

export interface Succeed<T> {
  ok: true
  value: T
}

export type ApiResult<T> = Failed | Succeed<T>

export function fail(msg: string = ''): Failed {
  return {
    ok: false,
    error: msg,
  }
}

export function success<T>(v: T): Succeed<T> {
  return {
    ok: true,
    value: v,
  }
}
  

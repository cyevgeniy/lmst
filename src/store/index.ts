export interface Store {
  getItem: (key: string) => string | undefined
  setItem: (key: string, value: unknown) => void
  removeItem: (key: string) => void
}

class LocalStorageStore implements Store {
  private prefix: string

  constructor(prefix: string) {
    this.prefix = prefix
  }

  private getKey(key: string): string {
    return `${this.prefix}-${key}`
  }

  getItem(key: string) {
    return localStorage.getItem(this.getKey(key)) ?? undefined
  }

  setItem(key: string, value: unknown) {
    let v: string = ''

    if (typeof value === 'string')
      v = value

    if (typeof value === 'object')
      v = JSON.stringify(value)

    if (typeof value === 'number')
      v = value.toString()

    if (v)
      localStorage.setItem(this.getKey(key), v)
    else
      localStorage.removeItem(this.getKey(key))
  }

  removeItem(key: string) {
    localStorage.removeItem(this.getKey(key))
  }
}

export class StoreFactory {
  // Right now we hava only one type of stores, so don't introduce
  // additional params
  createStore(prefix: string) {
    return new LocalStorageStore(prefix)
  }
}

export const store = (new StoreFactory()).createStore('lmst')

export interface Store {
  getItem: (key: string) => string | undefined
  setItem: (key: string, value: unknown) => void
  removeItem: (key: string) => void
}

function createLocalStorageStore(prefix: string): Store {
  function getKey(k: string): string {
    return `${prefix}-${k}`
  }

  return {
    getItem(key: string) {
      return localStorage.getItem(getKey(key)) ?? undefined
    },

    setItem(key: string, value: unknown) {
      let v: string = ''

      if (typeof value === 'string') v = value

      if (typeof value === 'object') v = JSON.stringify(value)

      if (typeof value === 'number') v = value.toString()

      if (v) localStorage.setItem(getKey(key), v)
      else localStorage.removeItem(getKey(key))
    },

    removeItem(key: string) {
      localStorage.removeItem(getKey(key))
    },
  }
}

export const store = createLocalStorageStore('lmst')

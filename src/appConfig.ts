import { store as localStore } from "./store"

export interface AppConfig {
  /**
   * Current server
   */
  server: string

  /**
   * A client name
   */
  clientName: string

  /**
   * Link to the source code repository
   */
  repo: string

  /**
   * Base url of the app
   */
  baseUrl: string

  /**
   * Application version
   */
  version: string
}

export interface ConfigHandlers {
  addOnServerChangeCb: (fn: CallbackFn) => void
}

type CallbackFn = (server: string) => void

// TODO: move to .env
const DEFAULT_SERVER = 'https://mastodon.social'
const SERVER_KEY = 'server'

function createConfig(): AppConfig & ConfigHandlers {
  let _server = ''
  const callbacks: CallbackFn[] = []

  function store() {
    localStore.setItem(SERVER_KEY, _server)
  }

  function load() {
    _server = localStore.getItem(SERVER_KEY) ?? DEFAULT_SERVER
  }

  function processCallbacks() {
    callbacks.forEach(fn => fn(_server))
  }

  return {
    clientName: 'lmst',
    repo: import.meta.env.VITE_REPOSITORY_URL,
    baseUrl: import.meta.env.VITE_BASE_URL,
    version: import.meta.env.VITE_APP_VERSION,
    addOnServerChangeCb(fn: CallbackFn) {
      callbacks.push(fn)
    },
    set server(v: string) {
      _server = v || DEFAULT_SERVER
      store()
      processCallbacks()
    },
    get server() {
      if (!_server)
        load()

      return _server
    }
  }
}

const config = createConfig()

export function useAppConfig() {
  return config
}

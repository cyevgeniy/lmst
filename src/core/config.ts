import { store as localStore } from '../store'
import { createSignal, on } from '../utils/signal'
import type { Signal } from '../utils/signal'

export interface AppConfig {
  /**
   * Current server
   */
  server: Signal<string>

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

// TODO: move to .env
const DEFAULT_SERVER = 'https://mastodon.social'
const SERVER_KEY = 'server'

let _server = createSignal('')

on(_server, (newValue) => {
  localStore.setItem(SERVER_KEY, newValue)
})

function load() {
  _server(localStore.getItem(SERVER_KEY) ?? DEFAULT_SERVER)
}

export let appConfig: AppConfig = {
  clientName: 'lmst',
  repo: import.meta.env.VITE_REPOSITORY_URL,
  baseUrl: import.meta.env.VITE_BASE_URL,
  version: import.meta.env.VITE_APP_VERSION,
  get server() {
    if (!_server()) load()

    return _server
  },
}

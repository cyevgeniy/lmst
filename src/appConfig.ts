import { store } from "./store"

interface AppConfig {
  server: string
  clientName: string
  repo: string
  baseUrl: string
}

type CallbackFn = (server: string) => void

const DEFAULT_SERVER = 'https://mastodon.social'
const SERVER_KEY = 'server'

export class LmstConfig implements AppConfig {
  private static instance: LmstConfig
  private readonly callbacks: CallbackFn[] = [] 
  private _server: string = ''
  public readonly clientName: string = ''
  public readonly repo: string = ''
  public readonly baseUrl: string = ''

  constructor() {
    if (LmstConfig.instance)
      return LmstConfig.instance

    this._server = ''
    this.clientName = 'lmst'
    this.repo = 'https://git.sr.ht/~ychbn/lmst'
    this.baseUrl = 'http://localhost:5173'
    this.callbacks = []

    LmstConfig.instance = this
  }

  public addOnServerChangeCb(fn: CallbackFn) {
    this.callbacks.push(fn)
  }

  public clearServerInfo() {
    this.server = ''
  }

  set server(v: string) {
    this._server = v
    this.store()
    this.processCallbacks()
  }

  private processCallbacks() {
    this.callbacks.forEach(fn => fn(this._server))
  }

  get server() {
    if (!this._server)
      this.load()

    return this._server ?? DEFAULT_SERVER
  }

  private store() {
    store.setItem(SERVER_KEY, this._server)
  }

  private load() {
    this.server = store.getItem(SERVER_KEY) ?? DEFAULT_SERVER
  }
}

// function defineLmstConfig(conf: AppConfig): AppConfig {
//   return conf
// }

// let config = defineLmstConfig({
//   server: '',
//   clientName: 'lmst',
//   repo: 'https://git.sr.ht/~ychbn/lmst',
//   baseUrl: 'http://localhost:5173',
// })

export function useAppConfig() {
  return new LmstConfig()
}

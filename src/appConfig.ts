interface AppConfig {
  server: string
  clientName: string
  repo: string
  baseUrl: string
}

function defineLmstConfig(conf: AppConfig): AppConfig {
  return conf
}

export default defineLmstConfig({
  server: 'https://mstdn.social',
  clientName: 'lmst',
  repo: 'https://git.sr.ht/~ychbn/lmst',
  baseUrl: 'http://localhost:5173',
})

interface AppConfig {
  server: string
  clientName: string
  repo: string
}

function defineLmstConfig(conf: AppConfig): AppConfig {
  return conf
}

export default defineLmstConfig({
  server: 'https://mastodon.social',
  clientName: 'lmst',
  repo: 'https://git.sr.ht/~ychbn/lmst'
})

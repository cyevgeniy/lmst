interface AppConfig {
  server: string
  clientName: string
}

function defineLmstConfig(conf: AppConfig): AppConfig {
  return conf
}

export default defineLmstConfig({
  server: 'https://mastodon.social',
  clientName: 'lmst',
})

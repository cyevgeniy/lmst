import { appConfig } from '../core/config'
import { a, div, h, span } from '../utils/dom'
import { on } from '../utils/signal'

export function LInfo() {
  const { server, repo } = appConfig

  let serverInfo = a('', server(), server()),
    el = div('infoblock', [
      h('h2', null, 'Client Info'),
      div('', [span('', 'Server: '), serverInfo]),

      div('', [span('', 'Repository: '), a('', repo, repo)]),
    ])

  on(server, (nv) => {
    serverInfo.setAttribute('href', nv)
    serverInfo.innerText = nv
  })

  return {
    el,
  }
}

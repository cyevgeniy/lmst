import { useAppConfig } from "../appConfig";
import { a, div, h, span } from "../utils/dom";
import { on } from "../utils/signal";

export function LInfo() {
  const appConfig = useAppConfig()
  const { server } = appConfig

  const serverInfo = a('', server(), server())

  const el = div('infoblock', [
    h('h2', null, 'Client Info'),
    div('', [
      span('', 'Server: '),
      serverInfo,
    ]),

    div('', [
      span('', 'Version: '),
      span('', appConfig.version),
    ]),

    div('', [
      span('', 'Repository: '),
      a('', appConfig.repo, appConfig.repo),
    ])
  ])

  on(server, (nv) => {
    serverInfo.setAttribute('href', nv)
    serverInfo.innerText = nv
  })

  return {
    el,
  }
}

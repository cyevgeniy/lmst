import { useAppConfig } from "../appConfig";
import { a, div, h, span } from "../utils/dom";

export function LInfo() {
  const appConfig = useAppConfig()

  const serverInfo = a('', appConfig.server, appConfig.server)

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

  appConfig.addOnServerChangeCb((server) => {
    serverInfo.setAttribute('href', server)
    serverInfo.innerText = server
  })

  return {
    el,
  }
}
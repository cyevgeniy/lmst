import { useAppConfig } from "../appConfig";
import { a, div, h, span } from "../utils/dom";

export class LInfo {
  private serverInfo: HTMLElement
  constructor(root: HTMLElement) {
    const appConfig = useAppConfig()

    this.serverInfo = a('', appConfig.server, appConfig.server)
    root.appendChild(div('infoblock', [
      h('h2', null, 'Client Info'),
      div('', [
        span('', 'Server: '),
        this.serverInfo,
      ]),

      div('', [
        span('', 'Version: '),
        span('', appConfig.version),
      ])


      // div('', [
      //   span('', 'Repository: '),
      //   a('', appConfig.repo, appConfig.repo),
      // ])
    ]))

    appConfig.addOnServerChangeCb((server) => {
      this.serverInfo.setAttribute('href', server)
      this.serverInfo.innerText = server
    })
  }
}

import appConfig from "../appConfig";
import { a, div, h, span } from "../utils/dom";

export function LInfo(root: HTMLElement) {
  function mount() {
    root.appendChild(div('infoblock', [
      h('h2', null, 'Info'),
      div('', [
        span('', 'Server: '),
        a('', appConfig.server, appConfig.server),
      ]),

      div('', [
        span('', 'Repository: '),
        a('', appConfig.repo, appConfig.repo),
      ])
    ]))
  }

  return {
    mount,
  }
}
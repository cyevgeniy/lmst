import { registerApp } from '../utils/app'
import appConfig from '../appConfig'

export function getStatuses(accountId: string) {
  const _server = `${appConfig.server}/api/v1/accounts/${accountId}/statuses`

  return registerApp().then(() => {
    const f = fetch(_server, {
      method: 'GET',
    })

    return f.then(response => {
      if (response.status === 200)
        return response.json()

      throw new Error('Can not load account statuses')
    })
      .catch(e => { throw new Error(e)})
  })
}

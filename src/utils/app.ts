import { registerApp as _registerApp, getAppToken } from "../api/app"

let appToken: string

export async function registerApp(): Promise<string> {

  if (appToken)
  	return appToken

  return _registerApp({
	  server: 'https://mastodon.social',
	  redirectUris: 'https://mastodon.social',
	  clientName: 'lmst'
	})
  .then( (r) => getAppToken({
    server: 'https://mastodon.social',
    client_id: r.client_id,
    client_secret: r.client_secret,
    redirect_uri: 'localhost:5173',
    grant_type: 'client_credentials'
  }) )
  .then(token => {
  	appToken = token
  	return token
  })
  .catch(err => {
  	console.log(err)
  	return ''
  })
}

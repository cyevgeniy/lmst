interface RegisterAppParams {
	server: string
	redirectUris: string
	clientName: string
}

interface RegisterAppResponse {
	id: string
	name: string
	website: string | null
	redirect_uri: string | null
	client_id: string
	client_secret: string
	vapid_key: string
}

export function registerApp(params: RegisterAppParams) {
	const payload = new FormData()
	payload.append('client_name', params.clientName)
	payload.append('redirect_uris', params.redirectUris)

	return fetch(`${params.server}/api/v1/apps`, {
		method: 'POST',
		body: payload,
	}).
	  then(response => {
		  if (response.status === 200)
			  return response.json() as Promise<RegisterAppResponse>

		  // TODO: get error messages from a server
		  throw new Error('Error during application registration')
	  })
}

export interface GetAppTokenParams {
	server: string
	client_id: string
	client_secret: string
	redirect_uri: string
	grant_type: string
	[k: string]: string
}

interface TokenEntity {
	access_token: string
	[k: string]: string
}

export function getAppToken(params: GetAppTokenParams): Promise<string> {
	const payload = new FormData()

	const {server, ...rest} = params

	for (const key in rest) {
		payload.append(key, rest[key])
	}

	const r = fetch(`${params.server}/oauth/token`, {
		method: 'POST',
		body: payload
	})

	return r.then(
    resp => {
		  if (resp.status === 200)
			  return (resp.json() as Promise<TokenEntity>).then(tokenEntity => tokenEntity.access_token)

		  // We are interested only 200 status code, so treat any other codes as errors, too
		  throw new Error('Can not obtain app token')
	  }
  ).catch(e => {
		throw new Error(e)
	})
}

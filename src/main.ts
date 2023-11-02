import '../assets/css/main.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { HelloWorld } from './components/HelloWorld.ts'
import { LPost } from './components/LPost'
import { registerApp, getAppToken } from './api/app.ts'
import { getPublicTimeline } from './api/timeline'

registerApp({
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
  .then(token => getPublicTimeline('https://mastodon.social', token))
  .then(timeline => {
    console.log(timeline)
    for (const post of timeline) {
      const { el } = LPost({content: post.content, created_at: post.created_at})
      document.getElementById('timeline-root').appendChild(el)
    }
  })
  .catch(err => console.log(err))


const { el: hw } = HelloWorld()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<div id="timeline-root" class="timeline-container"> </div>
`

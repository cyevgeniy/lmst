import './style.css'
import typescriptLogo from './typescript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.ts'
import { HelloWorld } from './components/HelloWorld.ts'
import { registerApp, getAppToken } from './api/app.ts'

// registerApp().then(r => r.json()).then(b => console.log(b))
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
.then(d => console.log(d))
.catch(err => console.log(err))


const { el: hw } = HelloWorld()

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://www.typescriptlang.org/" target="_blank">
      <img src="${typescriptLogo}" class="logo vanilla" alt="TypeScript logo" />
    </a>
    <h1>Vite + TypeScript</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite and TypeScript logos to learn more
    </p>
  </div>
`
document.querySelector<HTMLDivElement>('#app')!.appendChild(hw)


setupCounter(document.querySelector<HTMLButtonElement>('#counter')!)

import '../assets/css/main.css'
import { lRouter } from './router'
import { timelinePage } from './pages/timeline'
import { profilePage } from './pages/profile'
import { oauthPage } from './pages/oauth'

const buttons = document.createElement('div')
buttons.innerHTML = `<button id="btn"> Profile </div>
<button id="btn1"> Settings </div>`

document.getElementById('app')?.appendChild(buttons)

document.getElementById('btn')?.addEventListener('click', () => {
  lRouter.navigateTo('/profile/13/question/question-123/')
})

document.getElementById('btn1')?.addEventListener('click', () => {
  lRouter.navigateTo('/settings')
})

lRouter.on('/', () => timelinePage.mount())
lRouter.on('/profile/:id', (params) => profilePage.mount(params))
lRouter.on('/oauth', () => oauthPage.mount())



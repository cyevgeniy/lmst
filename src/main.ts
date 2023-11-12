import '../assets/css/main.css'
import { lRouter } from './router'
import { Page } from './pages/page'
import { Timeline } from './pages/timeline'
import { Profile } from './pages/profile'

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

const timelinePage = Page(Timeline)
const profilePage = Page(Profile)

lRouter.on('/', () => timelinePage.mount())
lRouter.on('/profile/:id', (params) => profilePage.mount(params))

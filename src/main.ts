import '../assets/css/main.css'
import { lRouter } from './router'
import { timelinePage } from './pages/timeline'
import { profilePage } from './pages/profile'
import { oauthPage } from './pages/oauth'
import { composePage } from './pages/compose'
import { useAppConfig } from "./appConfig"
import { User } from "./utils/user"
import { TimelineManager } from './appManager'

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

const appConfig = useAppConfig()
const user = new User()
const timelineManager = new TimelineManager({user, config: appConfig})

lRouter.on('/', () => timelinePage.mount(timelineManager))
lRouter.on('/profile/:id', (params) => profilePage.mount(params))
lRouter.on('/oauth', () => oauthPage.mount())
lRouter.on('/compose', () => composePage.mount())



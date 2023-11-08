import '../assets/css/main.css'
import { router } from './utils/useRouter'
import { lRouter } from './router'
//import { useRouter } from './utils/useRouter'
// import { createRouter } from './utils/router'

const buttons = document.createElement('div')
buttons.innerHTML = `<button id="btn"> Profile </div>
<button id="btn1"> Settings </div>`

document.getElementById('app')?.appendChild(buttons)

document.getElementById('btn')?.addEventListener('click', () => {
  // router.navigate('/profile/12', );
  lRouter.navigateTo('/profile')
})

document.getElementById('btn1')?.addEventListener('click', () => {
  // router.navigate('/settings');
  lRouter.navigateTo('/settings')

})

// const router = createRouter()
// router.addRoute({path: '/', callback: () => console.log('Main page callback')})
// router.addRoute({path: 'profile', callback: () => console.log('Profile callback')})
// router.addRoute({path: 'settings', callback: () => console.log('Settings callback')})

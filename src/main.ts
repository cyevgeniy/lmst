import '../assets/css/main.css'
import { lRouter } from './router'

const buttons = document.createElement('div')
buttons.innerHTML = `<button id="btn"> Profile </div>
<button id="btn1"> Settings </div>`

document.getElementById('app')?.appendChild(buttons)

document.getElementById('btn')?.addEventListener('click', () => {
  // router.navigate('/profile/12', );
  lRouter.navigateTo('/profile/13/question/question-123/')
})

document.getElementById('btn1')?.addEventListener('click', () => {
  // router.navigate('/settings');
  lRouter.navigateTo('/settings')

})

import '../assets/css/main.css'
import { useRouter } from './utils/useRouter'

// !!! should be single instance
const router = useRouter()

router.navigateTo('timeline')

const buttons = document.createElement('div')
buttons.innerHTML = `<button id="btn"> Profile </div>
<button id="btn1"> Settings </div>`

document.getElementById('app')?.appendChild(buttons)

document.getElementById('btn')?.addEventListener('click', () => {
  router.navigateTo('profile')
})

document.getElementById('btn1')?.addEventListener('click', () => {
  router.navigateTo('settings')
})

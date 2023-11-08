import { Settings } from '../pages/settings.ts'
import { Profile } from '../pages/profile.ts'
import { Page } from '../pages/page.ts'
import { Timeline } from '../pages/timeline.ts'
import Navigo from 'navigo'
 

const profilePage = Page(Profile)
const settingsPage = Page(Settings)
const timelinePage = Page(Timeline)

export const router = new Navigo('/');

router.on('/', function () {
  timelinePage.mount()
  router.resolve()
})

router.on('/profile/:id', function () {
  profilePage.mount()
  router.resolve()
});

router.on('/settings', function () {
  settingsPage.mount()
  router.resolve()
})

router.on('/timeline', function () {
  timelinePage.mount()

  router.resolve()
})


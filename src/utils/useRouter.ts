import { Settings } from '../pages/settings.ts'
import { Profile } from '../pages/profile.ts'
import { Page } from '../pages/page.ts'
import type { PageInstance } from '../pages/page'
import { Timeline } from '../pages/timeline.ts'

export interface RoutePage {
  page: PageInstance
}

export interface Router {
  [route: string]: RoutePage
}

export function useRouter() {
  const profilePage = Page(Profile)
  const settingsPage = Page(Settings)
  const timelinePage = Page(Timeline)

  let currentPage: string | undefined = undefined

  const router: Router = {
    profile: { page: profilePage},
    settings: { page: settingsPage},
    timeline: { page: timelinePage},
  }


  window.addEventListener('popstate', (e: PopStateEvent) => {
    navigateTo(e.state.page)
  })

  function navigateTo(page: string) {
    if (currentPage === page)
      return

    if (!router[page])
      throw new Error('No such page!')

    history.pushState({page}, '', `/${page}`)
    router[page].page.mount()
  }

  return {
    navigateTo,
  }
}

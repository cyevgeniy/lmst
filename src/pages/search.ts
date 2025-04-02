import { AppManager } from '../appManager'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LProfileListInfo } from '../components/LProfileListItem'
import { LStatusesList } from '../components/LStatusesList'
import { LNoMoreRows } from '../components/LNoMoreRows'
import { lRouter } from '../router'
import { Account } from '../types/shared'
import { childs, div, h, hide, show } from '../utils/dom'
import { on } from '../utils/signal'

function isTag(s: string): boolean {
  return s.length > 0 && s[0] === '#'
}

export function createSearchPage(root: HTMLElement, appManager: AppManager) {
  root.innerHTML = ''
  let input = h('input', { className: 'input' }),
    noMoreDataText = LNoMoreRows() //h('div', {className: 'timelime-no-more-rows'}, 'No more records')
  hide(noMoreDataText)

  input.type = 'search'
  input.placeholder = 'Search text or #hashtag'
  input.autofocus = true

  let loadMore = LLoadMoreBtn({
    text: 'Load more',
    onClick: () => search({ type: 'statuses' }),
  })

  loadMore.visible = false

  let summary = '<summary>Profiles</summary>',
    profilesRoot = div('accountsList'),
    profiles = h('details', {
      className: 'profileDetails',
      innerHTML: summary,
    })

  childs(profiles, [profilesRoot])
  hide(profiles)

  /**
   * Click event on a profile is delegated to rool Element.
   * The profiles are rendered with their `acct.acct` as 'data-acct' attribute.
   */
  profilesRoot.addEventListener('click', (e) => {
    let pLink = (e.target as any)?.closest('.profileItem'),
      acct = pLink?.getAttribute('data-acct')

    acct && lRouter.navigateTo(`/profile/${acct}/`)
  })

  let sm = appManager.searchManager

  let { loading } = sm

  // We don't use cleanup function because we cache search page and load it once
  on(loading, (newVal) => {
    loadMore.loading = newVal
  })

  function renderProfiles(accounts: Account[]) {
    for (const acct of accounts) {
      profilesRoot.appendChild(LProfileListInfo(acct).el)
    }
  }

  async function search(
    opts: {
      updateProfiles?: boolean
      type?: string
    } = {},
  ) {
    let { updateProfiles = false, type } = opts
    if (input.value !== '') {
      await sm.search({ q: input.value, type })
      let { accounts, statuses } = sm.searchResult
      slist.addStatuses(statuses)

      if (updateProfiles) {
        renderProfiles(accounts)
        !!accounts.length ? show(profiles) : hide(profiles)
      }

      if (sm.noMoreData) {
        loadMore.visible = false
        show(noMoreDataText)
      }
    }
  }

  async function onSubmit(e: SubmitEvent) {
    e.preventDefault()
    sm.resetOffset()
    hide(profiles)
    profilesRoot.innerHTML = ''
    slist.clearStatuses()

    if (isTag(input.value)) {
      lRouter.navigateTo(`tags/${input.value.slice(1)}`)
      input.value = ''
      loadMore.visible = false
      return
    }

    // We show profiles on new search only
    // Clicking on the 'load more' button will update only statuses list
    await search({ updateProfiles: true })

    // Show 'load more' button after the first search, but only when search didn't return an empty set
    // and the search query was not empty
    if (input.value) {
      !sm.noMoreData && (loadMore.visible = true) && hide(noMoreDataText)
    } else {
      loadMore.visible = false
      show(noMoreDataText)
    }
  }

  let statusesListRoot = h('div'),
    form = h('form', { onSubmit, className: 'form' }, [input]),
    el = h('div', { className: 'search' }, [
      form,
      profiles,
      statusesListRoot,
      noMoreDataText,
      loadMore.el,
    ]),
    slist = LStatusesList({
      root: statusesListRoot,
      statuses: [],
      sm: appManager.statusManager,
    })

  childs(root, [el])
  onMount()

  function onMount() {
    setTimeout(() => input.focus(), 0)
  }

  return {
    el,
    onMount,
  }
}

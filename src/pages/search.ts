import { AppManager } from '../appManager'
import { LLoadMoreBtn } from '../components/LLoadMoreBtn'
import { LStatusesList } from '../components/LStatusesList'
import { lRouter } from '../router'
import { childs, h } from '../utils/dom'

function isTag(s: string): boolean {
	return s.length > 0 && s[0] === '#'
}

export function createSearchPage(root: HTMLElement, appManager: AppManager) {
	root.innerHTML = ''
	const input = h('input', {className: 'search-input'})
	input.type = 'search'
	input.placeholder = 'Search text or #hashtag'
	input.autofocus = true

	let loadMore = LLoadMoreBtn({
		text: 'Load more',
		onClick: search,
	})

	loadMore.visible = false

	let sm = appManager.searchManager
	
	async function search() {
		if (input.value !== '') {
			loadMore.loading = true
			await sm.search({q: input.value })
			slist.addStatuses(sm.searchResult.statuses)
			if (sm.noMoreData) loadMore.visible = false
			loadMore.loading = false
		}
	}

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		sm.resetMaxId()
		slist.clearStatuses()

		if (isTag(input.value)) {
			lRouter.navigateTo(`tags/${input.value.slice(1)}`)
			input.value = ''
			loadMore.visible = false
			return
		}

		await search()
		// Show 'load more' button after first search, but only when search didn't return an empty set
		// and the search query was not empty
		if (input.value)
			!sm.noMoreData && (loadMore.visible = true)
		else
			loadMore.visible = false
	}

	const statusesListRoot = h('div')
	const form = h('form', {onSubmit, className: 'search-form'}, [input])
	const el = h('div', null, [form, statusesListRoot, loadMore.el])

	const slist = LStatusesList({
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
import { AppManager } from '../appManager'
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

	let sm = appManager.searchManager

	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		slist.clearStatuses()

		if (isTag(input.value)) {
			lRouter.navigateTo(`tags/${input.value.slice(1)}`)
			input.value = ''
			return
		}

		if (input.value !== '') {
			await sm.search(input.value)
			slist.addStatuses(sm.searchResult.statuses)
		}
	}

	const statusesListRoot = h('div')
	const form = h('form', {onSubmit,}, [input])
	const el = h('div', null, [form, statusesListRoot])

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
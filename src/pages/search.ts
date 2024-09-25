import { AppManager } from '../appManager'
import { LStatusesList } from '../components/LStatusesList'
import { childs, h } from '../utils/dom'

export function createSearchPage(root: HTMLElement, appManager: AppManager) {
	root.innerHTML = ''
	const input = h('input')
	input.type = 'sub'


	async function onSubmit(e: SubmitEvent) {
		e.preventDefault()
		await appManager.searchManager.search(input.value)
		slist.addStatuses(appManager.searchManager.searchResult.statuses)
		//console.log(appManager.searchManager.searchResult)
	}

	const statusesListRoot = h('div')
	const form = h('form', {onSubmit,}, [input, statusesListRoot])
	const el = h('div', null, [form])

	const slist = LStatusesList({
		root: statusesListRoot,
		statuses: [],
		sm: appManager.statusManager,
	})	

	childs(root, [el])

	return {
		el
	}
}
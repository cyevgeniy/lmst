import { Search } from '../types/shared'
import { fetchJson } from '../utils/fetch'
import { createSignal } from '../utils/signal'
import { searchParams } from '../utils/url'
import { appConfig } from './config'

type SearchParams = {
  q: string
  limit?: string
  type?: string
}

export function createSearchManager() {
  let res: Search,
    offset = 0,
    _noMoreData = false,
    loading = createSignal(false)

  let { server } = appConfig

  function resetOffset() {
    offset = 0
    _noMoreData = false
  }

  async function search(opts: SearchParams) {
    let q = searchParams({
      ...opts,
      offset: offset.toString(),
    })

    try {
      loading(true)
      res = await fetchJson(`${server()}/api/v2/search?${q}`, {
        withCredentials: true,
      })

      let len = res.statuses.length
      _noMoreData = len === 0
      offset += len
    } catch {
      res = {
        accounts: [],
        statuses: [],
        hashtags: [],
      }
    } finally {
      loading(false)
    }
  }

  return {
    search,
    get searchResult() {
      return res
    },
    get noMoreData() {
      return _noMoreData
    },
    resetOffset,
    loading,
  }
}

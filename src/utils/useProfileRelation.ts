import { useAppConfig } from '../appConfig'
import { getRelation } from '../api/account'
import { fetchJson } from './fetch'
import { Relationship, type Account } from '../types/shared'
import { createSignal } from '../utils/signal'

export function useProfileRelation() {
  const relation = createSignal<Relationship | undefined>(undefined)
  const loading = createSignal(false)
  let { server } = useAppConfig()

  /**
   * Depending on current relationship, this function
   * follows or unfollows the profile with specified id
   */
  async function followunfollow(id: Account['id']) {
    let endpoint = relation()?.following ? 'unfollow' : 'follow'
    try {
      loading(true)
      let res = await fetchJson<Relationship>(
        `${server()}/api/v1/accounts/${id}/${endpoint}`,
        {
          method: 'POST',
          withCredentials: true,
        },
      )

      relation(res)
    } catch (e) {
      relation(undefined)
    } finally {
      loading(false)
    }
  }

  async function updateRelation(id: Account['id']) {
    const rel = await getRelation(id)

    relation(rel.ok ? rel.value : undefined)
  }

  return {
    updateRelation,
    relation,
    loading,
    followunfollow,
  }
}

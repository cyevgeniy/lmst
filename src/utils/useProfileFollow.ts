import { useAppConfig } from '../appConfig'
import { getRelation } from '../api/account'
import { user } from './user'
import {Relationship, type Account} from '../types/shared'
import { createSignal } from '../utils/signal'

export function useProfileFollow() {
  const relation = createSignal<Relationship | undefined>(undefined)
  const loading = createSignal(false)
    let { server } = useAppConfig()

  async function followunfollow(id: Account['id']) {
    let endpoint = relation()?.following ? 'unfollow' : 'follow'
    loading(true)
    const resp = await fetch(`${server()}/api/v1/accounts/${id}/${endpoint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${user.accessToken()}`,
      },
    })
    loading(false)

    if (resp.status === 200)
      relation(await resp.json())
    else
      relation(undefined)
  }

  async function updateRelation(id: Account['id']) {
    loading(true)

    const rel = await getRelation(id)

    relation(rel.ok ? rel.value : undefined)

    loading(false)
  }

  return {
    updateRelation,
    relation,
    loading,
    followunfollow,
  }
}

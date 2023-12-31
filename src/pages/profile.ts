import { PageConstructor } from './page'
import { LStatusesList } from '../components/LStatusesList'
import type { Status } from '../types/shared.d.ts'

import { getStatuses } from '../api/account'

export const Profile: PageConstructor = () => {

  const el = document.createElement('div')
  let profileId: string = ''

  function update(params?: Record<string, string>) {
    profileId = params?.id ?? ''
    el.innerHTML = `<h1> Profile ${profileId} </h1>`
    getStatuses(profileId).then((resp as Status[]) => {
      console.log(resp)
      const statusesEl = LStatusesList(resp).mount()
      el.appendChild(statusesEl)
    })
  }

  function mount() {

    return el
  }

  function onParamsChange(params?: Record<string, string>) {
    update(params)
  }

  return { mount, onParamsChange }
}

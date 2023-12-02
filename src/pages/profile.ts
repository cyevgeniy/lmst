import { PageConstructor } from './page'

export const Profile: PageConstructor = () => {

  const el = document.createElement('div')
  let profileId: string = ''

  function update(params?: Record<string, string>) {
    profileId = params?.id ?? ''
    el.innerHTML = `<h1> Profile ${profileId} </h1>`
  }

  function mount() {
    return el
  }

  function onParamsChange(params?: Record<string, string>) {
    update(params)
  }

  return { mount, onParamsChange }
}

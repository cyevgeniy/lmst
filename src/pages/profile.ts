export function Profile() {

  const el = document.createElement('div')
  let profileId: string = ''

  function update(params?: Record<string, string>) {
    profileId = params?.id ?? ''
    el.innerHTML = `<h1> Profile ${profileId} </h1>`
  }

  function render() {
    return el
  }

  function onMount(params?: Record<string, string>) {
    update(params)
  }

  return { render, onMount }
}

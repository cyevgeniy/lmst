

export function Profile() {

  const el = document.createElement('div')
  el.innerHTML = `<h1> Profile </h1>`

  function render() {
    return el
  }

  return { render, }
}
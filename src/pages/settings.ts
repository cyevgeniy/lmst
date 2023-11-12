export function Settings() {

  const el = document.createElement('div')
  el.innerHTML = `<h1> Settings </h1>`

  function render() {
  	return el
  }

  function onMount(_?: Record<string,string>) {
  	console.log('Settings on mount event')
  }

  return { render, onMount }
}

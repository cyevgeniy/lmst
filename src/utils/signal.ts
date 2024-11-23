export interface Signal<T=any> {
  (): T
  (p: T): void
  (fn: (p: T) => T): void
}

let effects = new Map<Signal, any[]>()

export function createSignal<T=any>(value: T): Signal<T>  {
  let _value = value

  function signal(): T
  function signal(v: T): void
  function signal(v: (p: T)=> T): void
  function signal(v?: ((p: T)=> T) | T): T | void {
    let isSetter = arguments.length > 0

    if (isSetter) {
      if (typeof v === 'function') {
        // @ts-expect-error make it more type-safe later
        _value = v(_value)
      } else {
        // @ts-expect-error make it more type-safe later
        _value = v
      }

      // Find registered callbacks
      let signalEffects = effects.get(signal)
      if (signalEffects) {
        signalEffects.forEach(cb => cb(_value))
      }
    } else {
      return _value
    }
  }

  return signal
}

export function on<T=any>(signal: Signal<T>, cb: (p: T) => any) {
  let signalEffects = effects.get(signal)

  if (signalEffects) {
    signalEffects.push(cb)
  } else {
    effects.set(signal, [cb])
  }

  let idx = signalEffects?.findIndex(e => e === cb) ?? -1


  // We don't remove listeners anywhere yet, just for the future
  return () => idx !== -1 && signalEffects?.splice(idx, 1)
}

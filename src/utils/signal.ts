export interface Signal<T=any> {
  (): T
  (p: T): void
  (fn: (p: T) => T): void
}

const effects = new Map<Signal, any[]>()

export function createSignal<T=any>(value: T): Signal<T>  {
  let _value = value

  function signal(): T
  function signal(v: T): void
  function signal(v: (p: T)=> T): void
  function signal(v?: ((p: T)=> T) | T): T | void {
    const isSetter = arguments.length > 0

    if (isSetter) {
      if (typeof v === 'function') {
        // @ts-expect-error make it more type-safe later
        _value = v(_value)
      } else {
        // @ts-expect-error make it more type-safe later
        _value = v
      }

      // Find registered callbacks
      const signalEffects = effects.get(signal)
      if (signalEffects) {
        for (const cb of signalEffects) {
          cb(_value)
        }
      }
    } else {
      return _value
    }
  }

  return signal
}

export function on<T=any>(signal: Signal<T>, cb: (p: T) => any) {
  const signalEffects = effects.get(signal)

  if (signalEffects) {
    signalEffects.push(cb)
  } else {
    effects.set(signal, [cb])
  }


  // We don't remove listeners anywhere yet, just for the future
  return () => effects.delete(signal)
}

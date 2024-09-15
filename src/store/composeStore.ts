import { createSignal, on } from '../utils/signal'

/**
 * Compose message text
 */
export const text = createSignal('')

/**
 * Whether it's allowed to post a message
 */
export const postAvailable = createSignal(false)

on(text, (newVal) => postAvailable(newVal.length > 0))


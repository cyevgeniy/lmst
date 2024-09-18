import { createSignal, on } from '../utils/signal'

export function useCompose() {
    /**
     * Compose message text
     */
    const text = createSignal('')

    /**
     * Whether it's allowed to post a message
     */
    const postAvailable = createSignal(false)

    const cleanup = on(text, newVal => postAvailable(newVal.length > 0))

    return {
        text,
        postAvailable,
        cleanup,
    }
}

export const { text, postAvailable } = useCompose()


import { createSignal, on } from '../utils/signal'

export function useCompose() {
  /**
   * Compose message text
   */
  let text = createSignal(''),
    /**
     * Files
     */
    files = createSignal<File[]>([]),
    /**
     * Whether it's allowed to post a message
     */
    postAvailable = createSignal(false),
    textCleanup = on(text, (newVal) => {
      postAvailable(files().length > 0 ? true : newVal.length > 0)
    }),
    filesCleanup = on(files, (newVal) =>
      newVal?.length > 0
        ? postAvailable(true)
        : postAvailable(text().length > 0),
    ),
    cleanup = () => {
      textCleanup()
      filesCleanup()
    }

  return {
    text,
    files,
    postAvailable,
    cleanup,
    filesCleanup,
  }
}

export const { text, postAvailable, cleanup, files } = useCompose()

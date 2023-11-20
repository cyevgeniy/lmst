import type { Status } from '../types/shared.d.ts'

const timeline: Status[] = []

export function useTimeline() {
  return {
    timeline,
  }
}

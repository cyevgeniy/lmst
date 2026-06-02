import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  getPublicTimeline,
  PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE,
} from './timeline'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('getPublicTimeline', () => {
  it('uses instance access config to detect auth requirement before loading timeline', async () => {
    let fetchMock = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          configuration: {
            timelines_access: {
              live_feeds: {
                local: 'public',
                remote: 'authenticated',
              },
            },
          },
        }),
    })

    vi.stubGlobal('fetch', fetchMock)

    let result = await getPublicTimeline('https://config-check.example')

    expect(result).toEqual({
      ok: false,
      error: PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE,
    })
    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0]?.[0]).toBe(
      'https://config-check.example/api/v2/instance',
    )
  })

  it('returns a friendly message when public timeline requires auth', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 401,
          statusText: 'Unauthorized',
          text: () =>
            Promise.resolve(
              '{"error":"This API requires an authenticated user"}',
            ),
        }),
    )

    let result = await getPublicTimeline('https://unauthorized.example')

    expect(result).toEqual({
      ok: false,
      error: PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE,
    })
  })

  it('preserves HttpError details for non-auth failures', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 500,
          statusText: 'Server Error',
          text: () => Promise.resolve('oops'),
        }),
    )

    let result = await getPublicTimeline('https://server-error.example')

    expect(result).toEqual({
      ok: false,
      error: 'oops',
    })
  })

  it('treats 422 as auth required fallback', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: () => Promise.resolve({}),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 422,
          statusText: 'Unprocessable Content',
          text: () => Promise.resolve('unprocessable'),
        }),
    )

    let result = await getPublicTimeline('https://fallback-422.example')

    expect(result).toEqual({
      ok: false,
      error: PUBLIC_TIMELINE_AUTH_REQUIRED_MESSAGE,
    })
  })
})

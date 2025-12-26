import { lRouter } from '../router'
import type { Context, MediaAttachment, Status } from '../types/shared'
import { fail, success, type ApiResult } from '../utils/api'
import { logErr } from '../utils/errors'
import { fetchJson } from '../utils/fetch'
import { appConfig } from './config'
import { user, isLoaded as isUserLoaded } from './user'

export interface StatusPermissions {
  canBoost?: boolean
  canDelete?: boolean
}

type StatusId = Status['id']

export interface IStatusManager {
  postStatus(params: {
    statusText: string
    files?: File[]
  }): Promise<ApiResult<Status>>
  boostStatus(id: StatusId): Promise<void>
  unboostStatus(id: StatusId): Promise<void>
  deleteStatus(id: StatusId): Promise<void>
  getPermissions: () => StatusPermissions
  ownStatus(s: Status): boolean
}

/**
 * Returns a URL for the Status object
 * @param status Status
 * @returns A URL string for the status object
 */
function getLinkToStatus(status: Status): string {
  let _server = appConfig.server().slice(8)
  return `/status/${_server}/${status.account.acct}/${status.id}`
}

export function navigateToStatus(status: Status): void {
  lRouter.navigateTo(getLinkToStatus(status))
}

async function uploadFile(file: File): Promise<MediaAttachment | undefined> {
  let body = new FormData()
  body.append('file', file)

  try {
    return await fetchJson<MediaAttachment>(
      `${appConfig.server()}/api/v2/media`,
      {
        method: 'post',
        withCredentials: true,
        body,
      },
    )
  } catch {
    // we want to return undefined in such cases
  }
}

// Uploads specified files and returns their ids
async function uploadFiles(files: File[]): Promise<string[]> {
  let proms: Promise<MediaAttachment | undefined>[] = []

  for (const f of files) proms.push(uploadFile(f))

  // @ts-expect-error don't add type guard to the filter for size limit reasons
  return (await Promise.allSettled(proms))
    .map((r) => (r.status === 'fulfilled' ? r.value?.id : undefined))
    .filter(Boolean)
}

export async function postStatus(params: {
  statusText: string
  in_reply_to_id?: string
  files?: File[]
  sensitive?: boolean
}): Promise<ApiResult<Status>> {
  let mediaIds = params.files ? await uploadFiles(params.files) : []

  let payload = new FormData()
  payload.append('status', params.statusText)
  for (const id of mediaIds) payload.append('media_ids[]', id)

  params.in_reply_to_id &&
    payload.append('in_reply_to_id', params.in_reply_to_id)
  // TODO: need to create a function that generates FormData for specified payload
  params.sensitive && payload.append('sensitive', params.sensitive.toString())

  try {
    let resp = await fetchJson<Status>(
      `${appConfig.server()}/api/v1/statuses`,
      {
        method: 'post',
        withCredentials: true,
        body: payload,
      },
    )

    return success(resp)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

export async function boostStatus(id: StatusId): Promise<void> {
  if (!isUserLoaded()) return

  try {
    await fetchJson(`${appConfig.server()}/api/v1/statuses/${id}/reblog`, {
      method: 'post',
      withCredentials: true,
    })
  } catch (e: unknown) {
    if (import.meta.env.DEV) logErr(e)
  }
}

export async function unboostStatus(id: StatusId): Promise<void> {
  if (!isUserLoaded()) return

  try {
    await fetchJson(`${appConfig.server()}/api/v1/statuses/${id}/unreblog`, {
      method: 'post',
      withCredentials: true,
    })
  } catch (e: unknown) {
    if (import.meta.env.DEV) logErr(e)
  }
}

export async function deleteStatus(id: StatusId) {
  try {
    await fetchJson(`${appConfig.server()}/api/v1/statuses/${id}`, {
      method: 'DELETE',
      withCredentials: true,
    })
  } catch (e: unknown) {
    if (import.meta.env.DEV) logErr(e)
  }
}

export async function getStatus(
  id: StatusId,
  opts?: { server?: string },
): Promise<ApiResult<Status>> {
  try {
    const resp = await fetchJson<Status>(
      `${opts?.server ?? appConfig.server()}/api/v1/statuses/${id}`,
    )

    return success(resp)
  } catch (e: unknown) {
    return fail(logErr(e))
  }
}

export async function getStatusContext(
  id: StatusId,
  opts?: { server: string },
): Promise<ApiResult<Context>> {
  let result: ApiResult<Context>

  try {
    let resp = await fetch(
      `${opts?.server ?? appConfig.server()}/api/v1/statuses/${id}/context`,
    )

    if (resp.status !== 200) throw new Error('Context was not fetched')

    result = success(await resp.json())
  } catch (e: unknown) {
    result = fail(logErr(e))
  }

  return result
}

export function getPermissions(): StatusPermissions {
  let loaded = isUserLoaded()
  return {
    canDelete: loaded,
    canBoost: loaded,
  }
}

export function ownStatus(s: Status) {
  return user().acct === s.account.acct
}

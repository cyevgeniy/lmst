export interface Account {
  /**
   * Account id
   */
  id: string

  /**
   * Avatar's url
   */
  avatar: string

  /**
   * User name to display
   */
  display_name: string

  /**
   * URL to username's account
   */
  url: string

  /**
   * The profile’s bio or description.
   */
  note?: string

  /**
   * @username or server@username
   */
  acct?: string
}


/**
 * This interface represents media that can be attached to a Status
 */
export interface MediaAttachment {
  id: string
  type: 'unknown' | 'image' | 'gifv' | 'audio'
  url: string
  preview_url: string
  remote_url?: string
  description: string
  blurhash: string
}


export interface Status {
  /**
   * ID of the status in the database
   */
  id: string

  /**
   * The date when this status was created.
   * ISO 8601 Datetime string
   */
  created_at: string

  /**
   * HTML-encoded status content
   */
  content: string

  /**
   * The account that authored this status
   */
  account: Account

  /**
   * It may be an empty array, but not nullish
   */
  media_attachments: MediaAttachment[]

  /**
   * The status being reblogged.
   */
  reblog: Status | null

  /**
   * Sensitive content?
   */
  sensitive: boolean

  /**
   * Is a status was boosted by the current user
   */
  reblogged?: boolean

  /**
   * Url
   */
  url: string
}

export interface Context {
  ancestors: Status[]
  descendants: Status[]
}

export interface PaginationParams {
  limit?: number
  since_id?: string
  max_id?: string
  min_id?: string
}

export interface Mediator {
  notify(msg: string): void
}

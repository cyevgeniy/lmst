export interface Account {
  /**
   * Avatar's url
   */
  avatar?: string

  /**
   * User name to display
   */
  display_name: string

  /**
   * URL to username's account
   */
  url: string
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
}

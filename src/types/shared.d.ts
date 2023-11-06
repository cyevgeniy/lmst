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
}

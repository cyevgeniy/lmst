import type { Status } from '../types/shared.d.ts'
import { User } from '../utils/user.ts'
import type { AppConfig } from '../appConfig'

export class StatusActions {
  private readonly config: AppConfig
  private readonly user: User

  constructor(config: AppConfig, user: User) {
    this.config = config
    this.user = user
  }

  public async bookmark(id: Status['id']) {
    await this.user.verifyCredentials()
    await this.user.loadTokenFromStore()

    try {
      const resp = await fetch(`${this.config.server}/api/v1/statuses/${id}/bookmark`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.user.accessToken()}`,
        },
      })

      if (resp.status !== 200)
        throw new Error('Failed to bookmark the status')

    } catch (e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }

  public async delete(id: Status['id']) {
    await this.user.verifyCredentials()
    await this.user.loadTokenFromStore()

    try {
       const resp = await fetch(`${this.config.server}/api/v1/statuses/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${this.user.accessToken()}`,
        },
       })
    }
    catch (e: unknown) {
      if (e instanceof Error)
        console.error(e.message)
    }
  }
}


/* export async function bookmark(id: Status['id'], server: string) {
  try {
    const resp = await fetch(`${server}/api/v2`) */

import 'dotenv/config'
import { z } from 'zod'

const env = z.object({
  VITE_BASE_URL: z.string().url(),
  VITE_REPOSITORY_URL: z.string().url(),
})

let result = env.safeParse(process.env)

if (result.error) {
  console.error('.env file is misconfigured')
  console.error(result.error.errors)
}

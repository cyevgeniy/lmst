import 'dotenv/config'
import * as v from 'valibot'

const env = v.object({
  VITE_BASE_URL: v.pipe(v.string(), v.url()),
  VITE_REPOSITORY_URL: v.pipe(v.string(), v.url()),
})

const result = v.safeParse(env, process.env)

if (!result.success) {
  console.error('.env file is misconfigured')
  console.error(v.flatten(result.issues).nested)
}

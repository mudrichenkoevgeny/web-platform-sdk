import { z } from 'zod'

export const accountUnlockSearchSchema = z.object({
  lockoutType: z.string().optional(),
  lockoutUntil: z.string().optional()
})

export type AccountUnlockSearchParams = z.infer<typeof accountUnlockSearchSchema>

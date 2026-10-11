import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const accountUnlockSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional(),
  lockoutType: z.string().optional(),
  lockoutUntil: z.string().optional()
})

export type AccountUnlockSearchParams = z.infer<typeof accountUnlockSearchSchema>

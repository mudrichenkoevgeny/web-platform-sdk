import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

/** Search parameter validation schema for Account Unlock route. */
export const accountUnlockSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional(),
  lockoutType: z.string().optional(),
  lockoutUntil: z.string().optional()
})

/** Inferred search parameters type for Account Unlock route. */
export type AccountUnlockSearchParams = z.infer<typeof accountUnlockSearchSchema>

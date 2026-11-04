import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

/** Search parameter validation schema for Unlock Target Input screen route. */
export const unlockTargetSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional()
})

/** Inferred search parameters type for Unlock Target Input screen route. */
export type UnlockTargetSearchParams = z.infer<typeof unlockTargetSearchSchema>

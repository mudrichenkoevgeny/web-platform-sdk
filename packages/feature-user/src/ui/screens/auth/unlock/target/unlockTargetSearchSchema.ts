import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const unlockTargetSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional()
})

export type UnlockTargetSearchParams = z.infer<typeof unlockTargetSearchSchema>

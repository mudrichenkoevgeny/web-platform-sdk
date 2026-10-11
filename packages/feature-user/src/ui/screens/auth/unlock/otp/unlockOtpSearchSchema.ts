import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

export const unlockOtpSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional(),
  target: z.string().optional(),
  initialDelaySeconds: z.coerce.number().optional()
})

export type UnlockOtpSearchParams = z.infer<typeof unlockOtpSearchSchema>

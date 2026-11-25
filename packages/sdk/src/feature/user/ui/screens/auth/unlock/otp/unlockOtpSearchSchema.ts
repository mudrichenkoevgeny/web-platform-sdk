import { z } from 'zod'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'

/** Search parameter validation schema for Unlock OTP screen route. */
export const unlockOtpSearchSchema = z.object({
  method: z.nativeEnum(UnlockMethod).optional(),
  target: z.string().optional(),
  initialDelaySeconds: z.coerce.number().optional()
})

/** Inferred search parameters type for Unlock OTP screen route. */
export type UnlockOtpSearchParams = z.infer<typeof unlockOtpSearchSchema>

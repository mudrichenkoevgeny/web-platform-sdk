import { z } from 'zod'
import { loginByTotpModeSchema } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Search parameter schema for LoginByTotpScreen route.
 */
export const loginByTotpSearchSchema = z.object({
  loginTotpMode: loginByTotpModeSchema.optional()
})

/**
 * Inferred search parameters type for LoginByTotpScreen route.
 */
export type LoginByTotpSearch = z.infer<typeof loginByTotpSearchSchema>

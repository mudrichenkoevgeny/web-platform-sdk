import { z } from 'zod'

/**
 * Search parameter schema for TotpMainScreen route.
 */
export const totpMainSearchSchema = z.object({
  totpMode: z.enum(['disabled', 'setupInProgress', 'enabled']).optional()
})

/**
 * Inferred search parameters type for TotpMainScreen route.
 */
export type TotpMainSearch = z.infer<typeof totpMainSearchSchema>

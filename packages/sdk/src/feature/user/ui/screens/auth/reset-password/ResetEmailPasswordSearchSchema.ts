import { z } from 'zod'

/**
 * Search parameter schema for ResetEmailPasswordScreen route.
 */
export const resetEmailPasswordSearchSchema = z.object({
  resetStep: z.enum(['email_input', 'reset_input']).optional()
})

/**
 * Inferred search parameters type for ResetEmailPasswordScreen route.
 */
export type ResetEmailPasswordSearch = z.infer<typeof resetEmailPasswordSearchSchema>

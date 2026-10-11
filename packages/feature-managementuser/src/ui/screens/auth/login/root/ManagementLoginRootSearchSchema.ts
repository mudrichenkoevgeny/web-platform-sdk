import { z } from 'zod'

/**
 * Search parameter schema for ManagementLoginRootScreen route.
 */
export const managementLoginRootSearchSchema = z.object({
  loginStep: z
    .enum(['email', 'totp', 'unlock', 'pending_deletion'])
    .optional(),
  mfaToken: z.string().optional(),
  lockoutType: z.string().optional(),
  lockoutUntil: z.number().optional()
})

/**
 * Inferred search parameters type for ManagementLoginRootScreen route.
 */
export type ManagementLoginRootSearch = z.infer<typeof managementLoginRootSearchSchema>

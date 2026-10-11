import { z } from 'zod'

/**
 * Search parameter schema for ClientLoginRootScreen route.
 */
export const clientLoginRootSearchSchema = z.object({
  loginStep: z
    .enum([
      'welcome',
      'email',
      'phone',
      'registration',
      'reset_password',
      'totp',
      'unlock',
      'pending_deletion'
    ])
    .optional(),
  mfaToken: z.string().optional(),
  lockoutType: z.string().optional(),
  lockoutUntil: z.number().optional()
})

/**
 * Inferred search parameters type for ClientLoginRootScreen route.
 */
export type ClientLoginRootSearch = z.infer<typeof clientLoginRootSearchSchema>

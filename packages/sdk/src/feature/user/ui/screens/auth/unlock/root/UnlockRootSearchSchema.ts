import { z } from 'zod'

/**
 * Search parameter schema for UnlockRootScreen route.
 */
export const unlockRootSearchSchema = z.object({
  unlockStep: z.enum(['selection', 'target_input', 'otp', 'success']).optional(),
  unlockMethod: z.enum(['EMAIL', 'PHONE', 'GOOGLE', 'APPLE']).optional(),
  unlockTarget: z.string().optional()
})

/**
 * Inferred search parameters type for UnlockRootScreen route.
 */
export type UnlockRootSearch = z.infer<typeof unlockRootSearchSchema>

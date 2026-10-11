import { z } from 'zod'

/**
 * Search parameter schema for LoginByPhoneScreen route.
 */
export const loginByPhoneSearchSchema = z.object({
  loginPhoneStep: z.enum(['phone', 'code']).optional()
})

/**
 * Inferred search parameters type for LoginByPhoneScreen route.
 */
export type LoginByPhoneSearch = z.infer<typeof loginByPhoneSearchSchema>

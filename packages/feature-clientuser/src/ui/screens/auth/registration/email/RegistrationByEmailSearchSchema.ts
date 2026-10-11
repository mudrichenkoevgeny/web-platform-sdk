import { z } from 'zod'

/**
 * Search parameter schema for RegistrationByEmailScreen route.
 */
export const registrationByEmailSearchSchema = z.object({
  registrationStep: z.enum(['email_input', 'registration_input']).optional()
})

/**
 * Inferred search parameters type for RegistrationByEmailScreen route.
 */
export type RegistrationByEmailSearch = z.infer<typeof registrationByEmailSearchSchema>

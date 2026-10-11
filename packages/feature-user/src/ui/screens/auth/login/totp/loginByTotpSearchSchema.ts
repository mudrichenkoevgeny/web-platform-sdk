import { z } from 'zod'
import { LoginByTotpMode } from '@/ui/screens/auth/login/totp/login-by-totp-store'

/**
 * Search parameter schema for LoginByTotpScreen route.
 */
export const loginByTotpSearchSchema = z.object({
  loginTotpMode: z.nativeEnum(LoginByTotpMode).optional()
})

/**
 * Inferred search parameters type for LoginByTotpScreen route.
 */
export type LoginByTotpSearch = z.infer<typeof loginByTotpSearchSchema>

import type { GoogleAuthService } from '@/auth/google/google-auth-service'

/**
 * Platform-provided authentication integrations for the user feature.
 */
export interface UserAuthServices {
  readonly googleAuth?: GoogleAuthService | null
}

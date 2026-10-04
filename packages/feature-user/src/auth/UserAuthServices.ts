import { GoogleAuthService } from './google/GoogleAuthService'

/**
 * Platform-provided authentication integrations for the user feature.
 */
export interface UserAuthServices {
  readonly googleAuth?: GoogleAuthService | null
}

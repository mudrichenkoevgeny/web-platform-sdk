import { UserAuthServices } from '@/auth/UserAuthServices'
import { GoogleAuthService } from '@/auth/google/GoogleAuthService'
import { GoogleAuthServiceMock } from './google/GoogleAuthServiceMock'

/**
 * Test/preview {@link UserAuthServices} with a configurable {@link GoogleAuthService}.
 */
export class UserAuthServicesMock implements UserAuthServices {
  public readonly googleAuth: GoogleAuthService

  /**
   * Constructs a new {@link UserAuthServicesMock}.
   *
   * @param googleAuth - Configurable Google auth mock
   */
  public constructor(googleAuth: GoogleAuthService = new GoogleAuthServiceMock()) {
    this.googleAuth = googleAuth
  }
}

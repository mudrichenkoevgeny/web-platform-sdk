import { UserAuthServices } from '@/auth/user-auth-services'
import { GoogleAuthService } from '@/auth/google/google-auth-service'
import { GoogleAuthServiceMock } from '@/mock/auth/google/google-auth-service-mock'

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

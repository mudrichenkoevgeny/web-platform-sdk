import type { UserAuthServices } from '@/feature/user/auth/user-auth-services'
import type { GoogleAuthService } from '@/feature/user/auth/google/google-auth-service'
import { GoogleAuthServiceMock } from '@/feature/user/mock/auth/google/google-auth-service-mock'

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

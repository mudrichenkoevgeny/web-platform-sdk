import { AuthDataPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userDetailsPayloadMock } from '@/mock/network/model/user/userDetailsPayloadMock'
import { sessionTokenPayloadMock } from '@/mock/network/model/token/sessionTokenPayloadMock'

/**
 * Creates a mock {@link AuthDataPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock auth data payload
 */
export const authDataPayloadMock = (
  overrides?: Partial<AuthDataPayload>
): AuthDataPayload => ({
  user: userDetailsPayloadMock(),
  session_token: sessionTokenPayloadMock(),
  ...overrides
})

import { toUserSessionPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionMock } from '@/mock/domain/model/session/user-session-mock'

/**
 * Creates a mock {@link UserSessionPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user session payload
 */
export const userSessionPayloadMock = (
  overrides?: Partial<UserSessionPayload>
): UserSessionPayload => ({
  ...toUserSessionPayload(userSessionMock()),
  ...overrides
})

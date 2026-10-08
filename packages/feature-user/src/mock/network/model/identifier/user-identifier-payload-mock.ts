import { toUserIdentifierPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierMock } from '@/mock/domain/model/identifier/user-identifier-mock'

/**
 * Creates a mock {@link UserIdentifierPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier payload
 */
export const userIdentifierPayloadMock = (
  overrides?: Partial<UserIdentifierPayload>
): UserIdentifierPayload => ({
  ...toUserIdentifierPayload(userIdentifierMock()),
  ...overrides
})

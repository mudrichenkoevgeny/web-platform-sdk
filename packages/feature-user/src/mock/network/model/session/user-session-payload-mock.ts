import { toUserSessionPrivatePayload, toUserSessionSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserSessionPrivatePayload, UserSessionSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userSessionPrivateMock, userSessionSummaryMock } from '@/mock/domain/model/session/user-session-mock'

/**
 * Creates a mock {@link UserSessionPrivatePayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user session private payload
 */
export const userSessionPrivatePayloadMock = (
  overrides?: Partial<UserSessionPrivatePayload>
): UserSessionPrivatePayload => ({
  ...toUserSessionPrivatePayload(userSessionPrivateMock()),
  ...overrides
})

/**
 * Creates a mock {@link UserSessionSummaryPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user session summary payload
 */
export const userSessionSummaryPayloadMock = (
  overrides?: Partial<UserSessionSummaryPayload>
): UserSessionSummaryPayload => ({
  ...toUserSessionSummaryPayload(userSessionSummaryMock()),
  ...overrides
})

export const userSessionPayloadMock = userSessionPrivatePayloadMock

import { toUserIdentifierPrivatePayload, toUserIdentifierSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserIdentifierPrivatePayload, UserIdentifierSummaryPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userIdentifierPrivateMock, userIdentifierSummaryMock } from '@/mock/domain/model/identifier/user-identifier-mock'

/**
 * Creates a mock {@link UserIdentifierPrivatePayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier private payload
 */
export const userIdentifierPrivatePayloadMock = (
  overrides?: Partial<UserIdentifierPrivatePayload>
): UserIdentifierPrivatePayload => ({
  ...toUserIdentifierPrivatePayload(userIdentifierPrivateMock()),
  ...overrides
})

/**
 * Creates a mock {@link UserIdentifierSummaryPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user identifier summary payload
 */
export const userIdentifierSummaryPayloadMock = (
  overrides?: Partial<UserIdentifierSummaryPayload>
): UserIdentifierSummaryPayload => ({
  ...toUserIdentifierSummaryPayload(userIdentifierSummaryMock()),
  ...overrides
})

export const userIdentifierPayloadMock = userIdentifierPrivatePayloadMock

import { toUserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserPrivatePayload } from '@mudrichenkoevgeny/shared-foundation'
import { userPrivateMock } from '@/mock/domain/model/user/user-details-mock'

/**
 * Creates a mock {@link UserPrivatePayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user private payload
 */
export const userPrivatePayloadMock = (
  overrides?: Partial<UserPrivatePayload>
): UserPrivatePayload => ({
  ...toUserPrivatePayload(userPrivateMock()),
  ...overrides
})

export const userDetailsPayloadMock = userPrivatePayloadMock

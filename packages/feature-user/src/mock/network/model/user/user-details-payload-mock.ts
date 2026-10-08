import { toUserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import type { UserDetailsPayload } from '@mudrichenkoevgeny/shared-foundation'
import { userDetailsMock } from '@/mock/domain/model/user/user-details-mock'

/**
 * Creates a mock {@link UserDetailsPayload} instance.
 *
 * @param overrides - Optional property overrides
 * @returns Mock user details payload
 */
export const userDetailsPayloadMock = (
  overrides?: Partial<UserDetailsPayload>
): UserDetailsPayload => ({
  ...toUserDetailsPayload(userDetailsMock()),
  ...overrides
})

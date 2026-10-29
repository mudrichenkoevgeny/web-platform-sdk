import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  CompositeAuditActionTypeParser,
  CompositeAuditResourceTypeParser,
  CompositeAuditMetadataKeyParser
} from '@mudrichenkoevgeny/shared-foundation'
import type { AuthStorage, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AuthStorageMock, createPopulatedUserStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUserComponent } from '@/di/management-user-component'
import type { ManagementUserComponentConfig } from '@/di/management-user-component'

/**
 * Builds a {@link ManagementUserComponent} backed by in-memory or fake collaborators for previews and tests.
 *
 * @param config - Optional configuration parameters
 * @returns Fully wired ManagementUserComponent instance using default or provided mocks
 */
export const managementUserComponentMock = (
  config?: Partial<ManagementUserComponentConfig>
): ManagementUserComponent => {
  const commonComponent: CommonComponent = config?.commonComponent ?? createMockCommonComponent()
  const authStorage: AuthStorage = config?.authStorage ?? new AuthStorageMock()
  const userStorage: UserStorage = config?.userStorage ?? createPopulatedUserStorageMock()

  const compositeActionTypeParser =
    config?.compositeActionTypeParser ?? new CompositeAuditActionTypeParser([])
  const compositeResourceTypeParser =
    config?.compositeResourceTypeParser ?? new CompositeAuditResourceTypeParser([])
  const compositeMetadataKeyParser =
    config?.compositeMetadataKeyParser ?? new CompositeAuditMetadataKeyParser([])

  return new ManagementUserComponent({
    commonComponent,
    authStorage,
    userStorage,
    compositeActionTypeParser,
    compositeResourceTypeParser,
    compositeMetadataKeyParser,
    ...config
  })
}

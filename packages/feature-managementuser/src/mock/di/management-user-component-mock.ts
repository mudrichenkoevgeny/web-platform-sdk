import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { AuthStorage, UserAuthServices, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AuthStorageMock, createPopulatedUserStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUserComponent } from '@/di/management-user-component'
import type { ManagementUserComponentConfig } from '@/di/management-user-component'
import type { CompositeAuditActionTypeParser, CompositeAuditMetadataKeyParser, CompositeAuditResourceTypeParser } from '@mudrichenkoevgeny/shared-foundation'

/**
 * Builds a {@link ManagementUserComponent} backed by in-memory or fake collaborators for previews and tests.
 *
 * @param config - Required configuration parameters including audit parsers
 * @returns Fully wired ManagementUserComponent instance using default or provided mocks
 */
export const managementUserComponentMock = (
  config: Partial<ManagementUserComponentConfig> & {
    compositeActionTypeParser: CompositeAuditActionTypeParser
    compositeResourceTypeParser: CompositeAuditResourceTypeParser
    compositeMetadataKeyParser: CompositeAuditMetadataKeyParser
  }
): ManagementUserComponent => {
  const commonComponent: CommonComponent = config.commonComponent ?? createMockCommonComponent()
  const settingsComponent: SettingsComponent = config.settingsComponent ?? createMockSettingsComponent()
  const securityComponent: SecurityComponent = config.securityComponent ?? createMockSecurityComponent()
  const authStorage: AuthStorage = config.authStorage ?? new AuthStorageMock()
  const userStorage: UserStorage = config.userStorage ?? createPopulatedUserStorageMock()
  const authServices: UserAuthServices = config.authServices ?? new UserAuthServicesMock()

  return new ManagementUserComponent({
    commonComponent,
    settingsComponent,
    securityComponent,
    authStorage,
    userStorage,
    authServices,
    ...config
  })
}

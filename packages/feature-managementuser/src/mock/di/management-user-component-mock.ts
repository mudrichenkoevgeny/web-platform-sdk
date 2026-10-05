import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { AuthStorage, UserAuthServices } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUserComponent } from '@/di/management-user-component'
import type { ManagementUserComponentConfig } from '@/di/management-user-component'

/**
 * Builds a {@link ManagementUserComponent} backed by in-memory or fake collaborators for previews and tests.
 *
 * @param config - Optional configuration overrides
 * @returns Fully wired ManagementUserComponent instance using default or provided mocks
 */
export const managementUserComponentMock = (
  config?: Partial<ManagementUserComponentConfig>
): ManagementUserComponent => {
  const commonComponent: CommonComponent = config?.commonComponent ?? createMockCommonComponent()
  const settingsComponent: SettingsComponent = config?.settingsComponent ?? createMockSettingsComponent()
  const securityComponent: SecurityComponent = config?.securityComponent ?? createMockSecurityComponent()
  const authStorage: AuthStorage = config?.authStorage ?? new AuthStorageMock()
  const authServices: UserAuthServices = config?.authServices ?? new UserAuthServicesMock()

  return new ManagementUserComponent({
    commonComponent,
    settingsComponent,
    securityComponent,
    authStorage,
    authServices,
    ...config
  })
}

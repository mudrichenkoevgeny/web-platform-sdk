import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { commonComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { SecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { securityComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { SettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { settingsComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { AuthStorage, UserAuthServices } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserComponent } from '@/di/client-user-component'
import type { ClientUserComponentConfig } from '@/di/client-user-component'

/**
 * Builds a {@link ClientUserComponent} backed by in-memory or fake collaborators for previews and tests.
 *
 * @param config - Optional configuration overrides
 * @returns Fully wired ClientUserComponent instance using default or provided mocks
 */
export const clientUserComponentMock = (
  config?: Partial<ClientUserComponentConfig>
): ClientUserComponent => {
  const commonComponent: CommonComponent = config?.commonComponent ?? commonComponentMock()
  const settingsComponent: SettingsComponent = config?.settingsComponent ?? settingsComponentMock()
  const securityComponent: SecurityComponent = config?.securityComponent ?? securityComponentMock()
  const authStorage: AuthStorage = config?.authStorage ?? new AuthStorageMock()
  const authServices: UserAuthServices = config?.authServices ?? new UserAuthServicesMock()

  return new ClientUserComponent({
    commonComponent,
    settingsComponent,
    securityComponent,
    authStorage,
    authServices,
    ...config
  })
}

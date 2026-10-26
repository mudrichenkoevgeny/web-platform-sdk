import type { CommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { OpenSecuritySettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenGlobalSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import type { OpenStorageSettingsRepository } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { OpenStorageSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { AuthStorage, UserAuthServices, UserStorage } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { AuthStorageMock, createPopulatedUserStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
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
  const commonComponent: CommonComponent = config?.commonComponent ?? createMockCommonComponent()
  const openGlobalSettingsRepository: OpenGlobalSettingsRepository =
    config?.openGlobalSettingsRepository ?? new OpenGlobalSettingsRepositoryMock()
  const openSecuritySettingsRepository: OpenSecuritySettingsRepository =
    config?.openSecuritySettingsRepository ?? new OpenSecuritySettingsRepositoryMock()
  const openStorageSettingsRepository: OpenStorageSettingsRepository =
    config?.openStorageSettingsRepository ?? new OpenStorageSettingsRepositoryMock()
  const authStorage: AuthStorage = config?.authStorage ?? new AuthStorageMock()
  const userStorage: UserStorage = config?.userStorage ?? createPopulatedUserStorageMock()
  const authServices: UserAuthServices = config?.authServices ?? new UserAuthServicesMock()

  return new ClientUserComponent({
    commonComponent,
    openGlobalSettingsRepository,
    openSecuritySettingsRepository,
    openStorageSettingsRepository,
    authStorage,
    userStorage,
    authServices,
    ...config
  })
}

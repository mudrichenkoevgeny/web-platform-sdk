import { describe, it, expect } from 'vitest'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { OpenStorageSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { clientUserComponentMock } from '@/mock/index.js'

describe('ClientUserComponent', () => {
  it('instantiates successfully with required dependencies', () => {
    const commonComponent = createMockCommonComponent()
    const openGlobalSettingsRepository = new OpenGlobalSettingsRepositoryMock()
    const openSecuritySettingsRepository = new OpenSecuritySettingsRepositoryMock()
    const openStorageSettingsRepository = new OpenStorageSettingsRepositoryMock()
    const authStorage = new AuthStorageMock()
    const authServices = new UserAuthServicesMock()

    const component = clientUserComponentMock({
      commonComponent,
      openGlobalSettingsRepository,
      openSecuritySettingsRepository,
      openStorageSettingsRepository,
      authStorage,
      authServices
    })

    expect(component).toBeDefined()
    expect(component.loginByEmailUseCase).toBeDefined()
    expect(component.refreshUserConfigurationUseCase).toBeDefined()
    expect(component.refreshOpenAuthSettingsUseCase).toBeDefined()
  })
})

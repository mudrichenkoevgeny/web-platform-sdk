import { describe, it, expect } from 'vitest'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ClientUserComponent } from './client-user-component'

describe('ClientUserComponent', () => {
  it('instantiates successfully with required dependencies', () => {
    const commonComponent = createMockCommonComponent()
    const settingsComponent = createMockSettingsComponent()
    const securityComponent = createMockSecurityComponent()
    const authStorage = new AuthStorageMock()
    const authServices = new UserAuthServicesMock()

    const component = new ClientUserComponent({
      commonComponent: commonComponent as any,
      settingsComponent: settingsComponent as any,
      securityComponent: securityComponent as any,
      authStorage: authStorage as any,
      authServices: authServices as any
    })

    expect(component).toBeDefined()
    expect(component.loginByEmailUseCase).toBeDefined()
    expect(component.refreshUserConfigurationUseCase).toBeDefined()
    expect(component.refreshOpenAuthSettingsUseCase).toBeDefined()
  })
})

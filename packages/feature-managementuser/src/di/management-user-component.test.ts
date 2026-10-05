import { describe, it, expect } from 'vitest'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { ManagementUserComponent } from './management-user-component'

describe('ManagementUserComponent', () => {
  it('instantiates successfully with required dependencies', () => {
    const commonComponent = createMockCommonComponent()
    const settingsComponent = createMockSettingsComponent()
    const securityComponent = createMockSecurityComponent()
    const authStorage = new AuthStorageMock()
    const authServices = new UserAuthServicesMock()

    const component = new ManagementUserComponent({
      commonComponent: commonComponent as any,
      settingsComponent: settingsComponent as any,
      securityComponent: securityComponent as any,
      authStorage: authStorage as any,
      authServices: authServices as any
    })

    expect(component).toBeDefined()
    expect(component.getAuditEventsUseCase).toBeDefined()
    expect(component.getUsersUseCase).toBeDefined()
    expect(component.getManagementAuthSettingsUseCase).toBeDefined()
    expect(component.getManagementGlobalSettingsUseCase).toBeDefined()
    expect(component.getManagementSecuritySettingsUseCase).toBeDefined()
    expect(component.refreshUserConfigurationUseCase).toBeDefined()
  })
})

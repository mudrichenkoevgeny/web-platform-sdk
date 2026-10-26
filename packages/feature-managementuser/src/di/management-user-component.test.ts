import { describe, it, expect } from 'vitest'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AuthStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { managementUserComponentMock } from '@/mock/di/management-user-component-mock'

describe('ManagementUserComponent', () => {
  it('instantiates successfully with required dependencies', () => {
    const commonComponent = createMockCommonComponent()
    const authStorage = new AuthStorageMock()

    const component = managementUserComponentMock({
      commonComponent,
      authStorage
    })

    expect(component).toBeDefined()
    expect(component.getAuditEventsUseCase).toBeDefined()
    expect(component.getUsersUseCase).toBeDefined()
    expect(component.getManagementAuthSettingsUseCase).toBeDefined()
    expect(component.getManagementGlobalSettingsUseCase).toBeDefined()
    expect(component.getManagementSecuritySettingsUseCase).toBeDefined()
    expect(component.refreshManagementUserConfigurationUseCase).toBeDefined()
  })
})

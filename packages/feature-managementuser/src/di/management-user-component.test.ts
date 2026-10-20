import { describe, it, expect } from 'vitest'
import {
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { AuthStorageMock, UserAuthServicesMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { managementUserComponentMock } from '@/mock/di/management-user-component-mock'

describe('ManagementUserComponent', () => {
  it('instantiates successfully with required dependencies', () => {
    const commonComponent = createMockCommonComponent()
    const settingsComponent = createMockSettingsComponent()
    const securityComponent = createMockSecurityComponent()
    const authStorage = new AuthStorageMock()
    const authServices = new UserAuthServicesMock()

    const component = managementUserComponentMock({
      commonComponent,
      settingsComponent,
      securityComponent,
      authStorage,
      authServices,
      compositeActionTypeParser: new CompositeAuditActionTypeParser([]),
      compositeResourceTypeParser: new CompositeAuditResourceTypeParser([]),
      compositeMetadataKeyParser: new CompositeAuditMetadataKeyParser([])
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

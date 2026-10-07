import {
  CommonAuditMetadataKey,
  CommonAuditResourceType,
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  SecurityAuditActionType,
  SecurityAuditResourceType,
  SettingsAuditActionType,
  SettingsAuditResourceType,
  UserAuditActionType,
  UserAuditMetadataKey,
  UserAuditResourceType
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { managementUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAppComponent } from '@/di/management-app-component'

/**
 * Builds a {@link ManagementAppComponent} backed by SDK mock components.
 */
export function managementAppComponentMock(): ManagementAppComponent {
  const mockCommonComponent = createMockCommonComponent()
  const mockSettingsComponent = createMockSettingsComponent()
  const mockSecurityComponent = createMockSecurityComponent()
  const mockManagementUserComponent = managementUserComponentMock({
    commonComponent: mockCommonComponent,
    settingsComponent: mockSettingsComponent,
    securityComponent: mockSecurityComponent
  })

  return new ManagementAppComponent({
    baseUrl: 'http://localhost:8080',
    compositeActionTypeParser: new CompositeAuditActionTypeParser([
      UserAuditActionType,
      SecurityAuditActionType,
      SettingsAuditActionType
    ]),
    compositeResourceTypeParser: new CompositeAuditResourceTypeParser([
      UserAuditResourceType,
      SecurityAuditResourceType,
      SettingsAuditResourceType,
      CommonAuditResourceType
    ]),
    compositeMetadataKeyParser: new CompositeAuditMetadataKeyParser([
      CommonAuditMetadataKey,
      UserAuditMetadataKey
    ]),
    mockCommonComponent,
    mockSettingsComponent,
    mockSecurityComponent,
    mockManagementUserComponent
  })
}

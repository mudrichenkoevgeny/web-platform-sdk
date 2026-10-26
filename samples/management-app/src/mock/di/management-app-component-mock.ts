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
import { createMockStorageComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { managementUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAppComponent } from '@/di/management-app-component'

/**
 * Builds a {@link ManagementAppComponent} backed by SDK mock components.
 *
 * @returns A fully initialized {@link ManagementAppComponent} instance with mock dependencies.
 */
export function managementAppComponentMock(): ManagementAppComponent {
  const mockCommonComponent = createMockCommonComponent()
  const mockSettingsComponent = createMockSettingsComponent()
  const mockSecurityComponent = createMockSecurityComponent()
  const mockStorageComponent = createMockStorageComponent()

  const compositeActionTypeParser = new CompositeAuditActionTypeParser([
    UserAuditActionType,
    SecurityAuditActionType,
    SettingsAuditActionType
  ])
  const compositeResourceTypeParser = new CompositeAuditResourceTypeParser([
    UserAuditResourceType,
    SecurityAuditResourceType,
    SettingsAuditResourceType,
    CommonAuditResourceType
  ])
  const compositeMetadataKeyParser = new CompositeAuditMetadataKeyParser([
    CommonAuditMetadataKey,
    UserAuditMetadataKey
  ])

  const mockManagementUserComponent = managementUserComponentMock({
    commonComponent: mockCommonComponent,
    openGlobalSettingsRepository: mockSettingsComponent.globalSettingsRepository,
    openSecuritySettingsRepository: mockSecurityComponent.securitySettingsRepository,
    openStorageSettingsRepository: mockStorageComponent.storageSettingsRepository,
    compositeActionTypeParser,
    compositeResourceTypeParser,
    compositeMetadataKeyParser
  })

  return new ManagementAppComponent({
    baseUrl: 'http://localhost:8080',
    compositeActionTypeParser,
    compositeResourceTypeParser,
    compositeMetadataKeyParser,
    mockCommonComponent,
    mockSettingsComponent,
    mockSecurityComponent,
    mockStorageComponent,
    mockManagementUserComponent
  })
}

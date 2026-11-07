import { describe, it, expect } from 'vitest'
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
import { ManagementAppComponent } from '@/di/management-app-component'

describe('ManagementAppComponent Dependency Injection', () => {
  it('should instantiate all management SDK components and wire required parsers', () => {
    const appComponent = new ManagementAppComponent({
      baseUrl: 'http://localhost:9091',
      appVersion: '1.0.0',
      apiVersion: 'v1',
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
      ])
    })

    expect(appComponent.isInitialized).toBe(false)
    expect(appComponent.commonComponent).toBeDefined()
    expect(appComponent.settingsComponent).toBeDefined()
    expect(appComponent.securityComponent).toBeDefined()
    expect(appComponent.storageComponent).toBeDefined()
    expect(appComponent.managementUserComponent).toBeDefined()
    expect(appComponent.authStorage).toBeDefined()

    // Verify lazy getters resolve use cases
    expect(appComponent.refreshManagementUserConfigurationUseCase).toBeDefined()
    expect(appComponent.syncManagementDataUseCase).toBeDefined()

    // Execute .init() to register error parsers and socket message handlers
    appComponent.init()
    expect(appComponent.isInitialized).toBe(true)

    // Idempotent init check
    expect(() => appComponent.init()).not.toThrow()
  })
})

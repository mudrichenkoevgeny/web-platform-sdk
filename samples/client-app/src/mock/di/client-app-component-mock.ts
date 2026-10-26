import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockStorageComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { clientUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { ClientAppComponent } from '@/di/client-app-component'

/**
 * Builds a {@link ClientAppComponent} backed by SDK mock components.
 *
 * @returns A fully initialized {@link ClientAppComponent} instance with mock dependencies.
 */
export function clientAppComponentMock(): ClientAppComponent {
  const mockCommonComponent = createMockCommonComponent()
  const mockSettingsComponent = createMockSettingsComponent()
  const mockSecurityComponent = createMockSecurityComponent()
  const mockStorageComponent = createMockStorageComponent()
  const mockClientUserComponent = clientUserComponentMock({
    commonComponent: mockCommonComponent,
    openGlobalSettingsRepository: mockSettingsComponent.globalSettingsRepository,
    openSecuritySettingsRepository: mockSecurityComponent.securitySettingsRepository,
    openStorageSettingsRepository: mockStorageComponent.storageSettingsRepository
  })

  return new ClientAppComponent({
    baseUrl: 'http://localhost:8080',
    mockCommonComponent,
    mockSettingsComponent,
    mockSecurityComponent,
    mockStorageComponent,
    mockClientUserComponent
  })
}

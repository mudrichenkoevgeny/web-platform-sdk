import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { clientUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { ClientAppComponent } from '@/di/client-app-component'

/**
 * Builds a {@link ClientAppComponent} backed by SDK mock components.
 */
export function clientAppComponentMock(): ClientAppComponent {
  const mockCommonComponent = createMockCommonComponent()
  const mockSettingsComponent = createMockSettingsComponent()
  const mockSecurityComponent = createMockSecurityComponent()
  const mockClientUserComponent = clientUserComponentMock({
    commonComponent: mockCommonComponent,
    settingsComponent: mockSettingsComponent,
    securityComponent: mockSecurityComponent
  })

  return new ClientAppComponent({
    baseUrl: 'http://localhost:8080',
    mockCommonComponent,
    mockSettingsComponent,
    mockSecurityComponent,
    mockClientUserComponent
  })
}

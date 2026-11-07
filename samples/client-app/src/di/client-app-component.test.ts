import { describe, it, expect } from 'vitest'
import { ClientAppComponent } from '@/di/client-app-component'

describe('ClientAppComponent Dependency Injection', () => {
  it('should instantiate all SDK components and wire dependencies correctly', () => {
    const appComponent = new ClientAppComponent({
      baseUrl: 'http://localhost:8080',
      appVersion: '1.0.0',
      apiVersion: 'v1'
    })

    expect(appComponent.isInitialized).toBe(false)
    expect(appComponent.commonComponent).toBeDefined()
    expect(appComponent.settingsComponent).toBeDefined()
    expect(appComponent.securityComponent).toBeDefined()
    expect(appComponent.storageComponent).toBeDefined()
    expect(appComponent.clientUserComponent).toBeDefined()
    expect(appComponent.authStorage).toBeDefined()
    expect(appComponent.mfaChallengeHandler).toBeDefined()

    // Verify lazy getters resolve use cases without throwing
    expect(appComponent.refreshUserConfigurationUseCase).toBeDefined()
    expect(appComponent.syncDataUseCase).toBeDefined()

    // Execute .init() to register error parsers and socket message handlers
    appComponent.init()
    expect(appComponent.isInitialized).toBe(true)

    // Idempotent init check
    expect(() => appComponent.init()).not.toThrow()
  })
})

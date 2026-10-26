import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { OpenStorageSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { createTestOpenAuthSettings, createTestOpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { RefreshOpenAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-open-auth-settings-use-case'
import { RefreshClientUserConfigurationUseCase } from '@/usecase/configuration/refresh-client-user-configuration-use-case'

describe('Client User Use Cases', () => {
  describe('RefreshOpenAuthSettingsUseCase', () => {
    it('delegates to openAuthSettingsRepository.refreshOpenAuthSettings', async () => {
      const repo = new OpenAuthSettingsRepositoryMock()
      const authSettings = createTestOpenAuthSettings()
      repo.emit(authSettings)
      const useCase = new RefreshOpenAuthSettingsUseCase(repo)

      const refreshAuthSettingsResult = await useCase.execute()
      expect(refreshAuthSettingsResult.success).toBe(true)
      if (refreshAuthSettingsResult.success) {
        expect(refreshAuthSettingsResult.data).toEqual(authSettings)
      }
    })
  })

  describe('RefreshClientUserConfigurationUseCase', () => {
    it('fetches user configuration and updates repositories on success', async () => {
      const configurationPayload = createTestOpenUserConfigurationPayload()

      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const storageRepo = new OpenStorageSettingsRepositoryMock()
      const authRepo = new OpenAuthSettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')
      const updateAuthSpy = vi.spyOn(authRepo, 'updateOpenAuthSettings')

      const useCase = new RefreshClientUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        storageRepo,
        authRepo
      )

      const refreshConfigResult = await useCase.execute()

      expect(refreshConfigResult.success).toBe(true)
      expect(updateGlobalSpy).toHaveBeenCalledTimes(1)
      expect(updateSecuritySpy).toHaveBeenCalledTimes(1)
      expect(updateStorageSpy).toHaveBeenCalledTimes(1)
      expect(updateAuthSpy).toHaveBeenCalledTimes(1)
    })

    it('returns error and does not update repositories on API failure', async () => {
      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown()))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const storageRepo = new OpenStorageSettingsRepositoryMock()
      const authRepo = new OpenAuthSettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')
      const updateAuthSpy = vi.spyOn(authRepo, 'updateOpenAuthSettings')

      const useCase = new RefreshClientUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        storageRepo,
        authRepo
      )

      const failedConfigResult = await useCase.execute()

      expect(failedConfigResult.success).toBe(false)
      expect(updateGlobalSpy).not.toHaveBeenCalled()
      expect(updateSecuritySpy).not.toHaveBeenCalled()
      expect(updateStorageSpy).not.toHaveBeenCalled()
      expect(updateAuthSpy).not.toHaveBeenCalled()
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenAuthSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { RefreshOpenAuthSettingsUseCase } from '@/usecase/auth/settings/refresh-open-auth-settings-use-case'
import { RefreshClientUserConfigurationUseCase } from '@/usecase/configuration/refresh-client-user-configuration-use-case'

describe('Client User Use Cases', () => {
  describe('RefreshOpenAuthSettingsUseCase', () => {
    it('delegates to openAuthSettingsRepository.refreshOpenAuthSettings', async () => {
      const repo = new OpenAuthSettingsRepositoryMock()
      const mockSettings = {
        passwordPolicy: { minLength: 8, requireDigit: false, requireLowercase: false, requireUppercase: false, requireSpecialChar: false },
        allowedAuthProviders: []
      }
      repo.emit(mockSettings as any)
      const useCase = new RefreshOpenAuthSettingsUseCase(repo)

      const result = await useCase.execute()
      expect(result.success).toBe(true)
      if (result.success) {
        expect(result.data).toEqual(mockSettings)
      }
    })
  })

  describe('RefreshClientUserConfigurationUseCase', () => {
    it('fetches user configuration and updates repositories on success', async () => {
      const mockPayload: OpenUserConfigurationPayload = {
        open_global_settings: {
          default_language: 'en',
          supported_languages: ['en', 'ru'],
          terms_of_service_url: null,
          privacy_policy_url: null
        },
        open_security_settings: {
          is_mfa_enabled: false,
          password_policy: { min_length: 8, is_digit_required: false, is_lowercase_required: false, is_uppercase_required: false, is_special_char_required: false }
        },
        open_auth_settings: {
          password_policy: { min_length: 8, is_digit_required: false, is_lowercase_required: false, is_uppercase_required: false, is_special_char_required: false },
          allowed_auth_providers: []
        }
      } as any

      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(mockPayload))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const authRepo = new OpenAuthSettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateAuthSpy = vi.spyOn(authRepo, 'updateOpenAuthSettings')

      const useCase = new RefreshClientUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        authRepo
      )

      const result = await useCase.execute()

      expect(result.success).toBe(true)
      expect(updateGlobalSpy).toHaveBeenCalledTimes(1)
      expect(updateSecuritySpy).toHaveBeenCalledTimes(1)
      expect(updateAuthSpy).toHaveBeenCalledTimes(1)
    })

    it('returns error and does not update repositories on API failure', async () => {
      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown()))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const authRepo = new OpenAuthSettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateAuthSpy = vi.spyOn(authRepo, 'updateOpenAuthSettings')

      const useCase = new RefreshClientUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        authRepo
      )

      const result = await useCase.execute()

      expect(result.success).toBe(false)
      expect(updateGlobalSpy).not.toHaveBeenCalled()
      expect(updateSecuritySpy).not.toHaveBeenCalled()
      expect(updateAuthSpy).not.toHaveBeenCalled()
    })
  })
})

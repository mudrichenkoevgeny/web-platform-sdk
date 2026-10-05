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
      repo.emit(mockSettings as unknown as Parameters<typeof repo.emit>[0])
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
          privacy_policy_url: null,
          terms_of_service_url: null,
          contact_support_email: null,
          min_supported_app_versions: {}
        },
        open_security_settings: {
          open_password_policy: {
            min_length: 8,
            require_letter: false,
            require_upper_case: false,
            require_lower_case: false,
            require_digit: false,
            require_special_char: false
          },
          otp_confirmation: {
            retry_after_seconds: 60,
            number_of_symbols: 6,
            expiration_seconds: 300
          }
        },
        open_auth_settings: {
          available_auth_providers: {
            primary: ['email'],
            secondary: []
          },
          max_total_identifiers: 5,
          max_email_identifiers: 3,
          max_phone_identifiers: 2,
          max_identifiers_per_external_provider: 1,
          is_registration_enabled: true
        }
      }

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

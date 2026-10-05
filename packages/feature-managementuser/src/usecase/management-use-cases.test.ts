import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import type { OpenUserConfigurationApi } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { OpenUserConfigurationPayload } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementAuditRepositoryMock } from '@/mock/audit/repository/management-audit-repository-mock'
import { ManagementUserRepositoryMock } from '@/mock/repository/user/management-user-repository-mock'
import { ManagementAuthSettingsRepositoryMock } from '@/mock/repository/auth/settings/management-auth-settings-repository-mock'
import { ManagementGlobalSettingsRepositoryMock } from '@/mock/repository/global-settings/management-global-settings-repository-mock'
import { ManagementSecuritySettingsRepositoryMock } from '@/mock/repository/security/settings/management-security-settings-repository-mock'
import { GetAuditEventsUseCase } from '@/usecase/audit/get-audit-events-use-case'
import { GetUsersUseCase } from '@/usecase/user/get-users-use-case'
import { GetManagementAuthSettingsUseCase } from '@/usecase/auth/settings/get-management-auth-settings-use-case'
import { GetManagementGlobalSettingsUseCase } from '@/usecase/global-settings/get-management-global-settings-use-case'
import { GetManagementSecuritySettingsUseCase } from '@/usecase/security/settings/get-management-security-settings-use-case'
import { RefreshManagementUserConfigurationUseCase } from '@/usecase/configuration/refresh-management-user-configuration-use-case'

describe('Management User Use Cases', () => {
  describe('GetAuditEventsUseCase', () => {
    it('delegates to audit repository', async () => {
      const repo = new ManagementAuditRepositoryMock()
      const useCase = new GetAuditEventsUseCase(repo)

      const result = await useCase.execute({ page: 0, pageSize: 10 })
      expect(result.success).toBe(true)
    })
  })

  describe('GetUsersUseCase', () => {
    it('delegates to management user repository', async () => {
      const repo = new ManagementUserRepositoryMock()
      const useCase = new GetUsersUseCase(repo)

      const result = await useCase.execute({ page: 0, pageSize: 10 })
      expect(result.success).toBe(true)
    })
  })

  describe('GetManagementAuthSettingsUseCase', () => {
    it('delegates to auth settings repository', async () => {
      const repo = new ManagementAuthSettingsRepositoryMock()
      const useCase = new GetManagementAuthSettingsUseCase(repo)

      const result = await useCase.execute()
      expect(result.success).toBe(true)
    })
  })

  describe('GetManagementGlobalSettingsUseCase', () => {
    it('delegates to global settings repository', async () => {
      const repo = new ManagementGlobalSettingsRepositoryMock()
      const useCase = new GetManagementGlobalSettingsUseCase(repo)

      const result = await useCase.execute()
      expect(result.success).toBe(true)
    })
  })

  describe('GetManagementSecuritySettingsUseCase', () => {
    it('delegates to security settings repository', async () => {
      const repo = new ManagementSecuritySettingsRepositoryMock()
      const useCase = new GetManagementSecuritySettingsUseCase(repo)

      const result = await useCase.execute()
      expect(result.success).toBe(true)
    })
  })

  describe('RefreshManagementUserConfigurationUseCase', () => {
    it('fetches user configuration and updates core repositories on success', async () => {
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
      }

      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(mockPayload))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')

      const useCase = new RefreshManagementUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo
      )

      const result = await useCase.execute()

      expect(result.success).toBe(true)
      expect(updateGlobalSpy).toHaveBeenCalledTimes(1)
      expect(updateSecuritySpy).toHaveBeenCalledTimes(1)
    })

    it('returns failure and skips repository updates on API error', async () => {
      const mockApi: OpenUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown()))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')

      const useCase = new RefreshManagementUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo
      )

      const result = await useCase.execute()

      expect(result.success).toBe(false)
      expect(updateGlobalSpy).not.toHaveBeenCalled()
      expect(updateSecuritySpy).not.toHaveBeenCalled()
    })
  })
})

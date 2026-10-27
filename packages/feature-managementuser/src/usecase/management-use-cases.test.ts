import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { OpenGlobalSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { OpenSecuritySettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { OpenStorageSettingsRepositoryMock } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { AuthStorageMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-user'
import type { ManagementUserConfigurationApi } from '@/network/api/configuration/management-user-configuration-api'
import { createTestManagementUserConfigurationPayload, createTestSessionToken } from '@mudrichenkoevgeny/shared-foundation'
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

      const auditEventsResult = await useCase.execute({ pageNumber: 1, pageSize: 10 })
      expect(isSuccess(auditEventsResult)).toBe(true)
    })
  })

  describe('GetUsersUseCase', () => {
    it('delegates to user repository', async () => {
      const repo = new ManagementUserRepositoryMock()
      const useCase = new GetUsersUseCase(repo)

      const userListResult = await useCase.execute({ pageNumber: 1, pageSize: 10 })
      expect(isSuccess(userListResult)).toBe(true)
    })
  })

  describe('GetManagementAuthSettingsUseCase', () => {
    it('delegates to auth settings repository', async () => {
      const repo = new ManagementAuthSettingsRepositoryMock()
      const useCase = new GetManagementAuthSettingsUseCase(repo)

      const settingsResult = await useCase.execute()
      expect(isSuccess(settingsResult)).toBe(true)
    })
  })

  describe('GetManagementGlobalSettingsUseCase', () => {
    it('delegates to global settings repository', async () => {
      const repo = new ManagementGlobalSettingsRepositoryMock()
      const useCase = new GetManagementGlobalSettingsUseCase(repo)

      const settingsResult = await useCase.execute()
      expect(isSuccess(settingsResult)).toBe(true)
    })
  })

  describe('GetManagementSecuritySettingsUseCase', () => {
    it('delegates to security settings repository', async () => {
      const repo = new ManagementSecuritySettingsRepositoryMock()
      const useCase = new GetManagementSecuritySettingsUseCase(repo)

      const settingsResult = await useCase.execute()
      expect(isSuccess(settingsResult)).toBe(true)
    })
  })

  describe('RefreshManagementUserConfigurationUseCase', () => {
    it('fetches user configuration and updates repositories on success when unauthenticated', async () => {
      const configurationPayload = createTestManagementUserConfigurationPayload()

      const mockApi: ManagementUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload)),
        getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const storageRepo = new OpenStorageSettingsRepositoryMock()
      const authRepo = new ManagementAuthSettingsRepositoryMock()
      const authStorage = new AuthStorageMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')

      const useCase = new RefreshManagementUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        storageRepo,
        authRepo,
        authStorage
      )

      const refreshConfigResult = await useCase.execute()

      expect(isSuccess(refreshConfigResult)).toBe(true)
      expect(mockApi.getOpenUserConfiguration).toHaveBeenCalledTimes(1)
      expect(updateGlobalSpy).toHaveBeenCalledTimes(1)
      expect(updateSecuritySpy).toHaveBeenCalledTimes(1)
      expect(updateStorageSpy).toHaveBeenCalledTimes(1)
    })

    it('fetches authenticated configuration when active session exists', async () => {
      const configurationPayload = createTestManagementUserConfigurationPayload()

      const mockApi: ManagementUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload)),
        getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultSuccess(configurationPayload))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const storageRepo = new OpenStorageSettingsRepositoryMock()
      const authRepo = new ManagementAuthSettingsRepositoryMock()
      const authStorage = new AuthStorageMock()
      await authStorage.updateTokens(createTestSessionToken())

      const useCase = new RefreshManagementUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        storageRepo,
        authRepo,
        authStorage
      )

      const refreshConfigResult = await useCase.execute()

      expect(isSuccess(refreshConfigResult)).toBe(true)
      expect(mockApi.getManagementUserConfiguration).toHaveBeenCalledTimes(1)
    })

    it('returns failure and skips repository updates on API error', async () => {
      const mockApi: ManagementUserConfigurationApi = {
        getOpenUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown())),
        getManagementUserConfiguration: vi.fn().mockResolvedValue(appResultFailure(CommonError.unknown()))
      }

      const globalRepo = new OpenGlobalSettingsRepositoryMock()
      const securityRepo = new OpenSecuritySettingsRepositoryMock()
      const storageRepo = new OpenStorageSettingsRepositoryMock()
      const authRepo = new ManagementAuthSettingsRepositoryMock()
      const authStorage = new AuthStorageMock()

      const updateGlobalSpy = vi.spyOn(globalRepo, 'updateOpenGlobalSettings')
      const updateSecuritySpy = vi.spyOn(securityRepo, 'updateOpenSecuritySettings')
      const updateStorageSpy = vi.spyOn(storageRepo, 'updateOpenStorageSettings')

      const useCase = new RefreshManagementUserConfigurationUseCase(
        mockApi,
        globalRepo,
        securityRepo,
        storageRepo,
        authRepo,
        authStorage
      )

      const refreshConfigResult = await useCase.execute()

      expect(refreshConfigResult.success).toBe(false)
      expect(updateGlobalSpy).not.toHaveBeenCalled()
      expect(updateSecuritySpy).not.toHaveBeenCalled()
      expect(updateStorageSpy).not.toHaveBeenCalled()
    })
  })
})

import { describe, it, expect, vi } from 'vitest'
import { appResultSuccess, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { AppType, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { GetAvailableUserAuthProvidersUseCase } from '@/usecase/auth/settings/get-available-user-auth-providers-use-case'
import type { OpenAuthSettingsRepository } from '@/repository/auth/settings/open-auth-settings-repository'
import type { OpenAuthSettings } from '@mudrichenkoevgeny/shared-foundation'

describe('GetAvailableUserAuthProvidersUseCase', () => {
  it('returns hardcoded EMAIL for MANAGEMENT app type', async () => {
    const useCase = new GetAvailableUserAuthProvidersUseCase(AppType.MANAGEMENT)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.primary).toEqual([UserAuthProvider.EMAIL])
    }
  })

  it('fetches providers from repository for CLIENT app type', async () => {
    const mockRepo = {
      getOpenAuthSettings: vi.fn().mockResolvedValue(
        appResultSuccess<OpenAuthSettings>({
          availableAuthProviders: { primary: [UserAuthProvider.EMAIL, UserAuthProvider.PHONE], secondary: [UserAuthProvider.GOOGLE] },
          maxTotalIdentifiers: 5,
          maxEmailIdentifiers: 2,
          maxPhoneIdentifiers: 2,
          maxIdentifiersPerExternalProvider: 1,
          isRegistrationEnabled: true
        })
      )
    } as unknown as OpenAuthSettingsRepository

    const useCase = new GetAvailableUserAuthProvidersUseCase(AppType.CLIENT, mockRepo)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    if (isSuccess(result)) {
      expect(result.data.primary).toEqual([UserAuthProvider.EMAIL, UserAuthProvider.PHONE])
    }
  })
})

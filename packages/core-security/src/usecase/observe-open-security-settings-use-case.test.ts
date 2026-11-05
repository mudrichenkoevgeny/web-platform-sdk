import { describe, it, expect, vi } from 'vitest'
import { createTestOpenSecuritySettingsPayload, toOpenSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { ObserveOpenSecuritySettingsUseCase } from '@/usecase/observe-open-security-settings-use-case'
import { OpenSecuritySettingsRepositoryMock } from '@/mock/repository/open-security-settings-repository-mock'

describe('ObserveOpenSecuritySettingsUseCase', () => {
  it('delegates observer registration to repository and receives updates', async () => {
    const initialSettings = toOpenSecuritySettings(createTestOpenSecuritySettingsPayload())
    const repo = new OpenSecuritySettingsRepositoryMock({ initialSettings })
    const useCase = new ObserveOpenSecuritySettingsUseCase(repo)

    const observer = vi.fn()
    const unsubscribe = useCase.execute(observer)

    expect(observer).toHaveBeenCalledWith(initialSettings)

    const newSettings = toOpenSecuritySettings(createTestOpenSecuritySettingsPayload())
    await repo.updateOpenSecuritySettings(newSettings)
    expect(observer).toHaveBeenCalledWith(newSettings)

    unsubscribe()
  })
})

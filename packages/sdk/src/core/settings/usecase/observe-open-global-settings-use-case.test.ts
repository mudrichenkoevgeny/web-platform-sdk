import { describe, it, expect, vi } from 'vitest'
import { createTestOpenGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ObserveOpenGlobalSettingsUseCase } from '@/core/settings/usecase/observe-open-global-settings-use-case'
import { OpenGlobalSettingsRepositoryMock } from '@/core/settings/mock/repository/open-global-settings-repository-mock'

describe('ObserveOpenGlobalSettingsUseCase', () => {
  it('delegates observer registration to repository and receives updates', async () => {
    const initialSettings = createTestOpenGlobalSettings()
    const repo = new OpenGlobalSettingsRepositoryMock({ initialSettings })
    const useCase = new ObserveOpenGlobalSettingsUseCase(repo)

    const observer = vi.fn()
    const unsubscribe = useCase.execute(observer)

    expect(observer).toHaveBeenCalledWith(initialSettings)

    const newSettings = createTestOpenGlobalSettings()
    await repo.updateOpenGlobalSettings(newSettings)
    expect(observer).toHaveBeenCalledWith(newSettings)

    unsubscribe()
  })
})

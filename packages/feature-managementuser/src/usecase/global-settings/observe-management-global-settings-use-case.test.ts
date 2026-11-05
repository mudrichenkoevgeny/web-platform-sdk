import { describe, it, expect, vi } from 'vitest'
import { createTestManagementGlobalSettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementGlobalSettingsRepositoryMock } from '@/mock/repository/global-settings/management-global-settings-repository-mock'
import { ObserveManagementGlobalSettingsUseCase } from './observe-management-global-settings-use-case'

describe('ObserveManagementGlobalSettingsUseCase', () => {
  it('delegates observer registration to repository and receives updates', () => {
    const repo = new ManagementGlobalSettingsRepositoryMock()
    const spy = vi.spyOn(repo, 'observeManagementGlobalSettings')
    const useCase = new ObserveManagementGlobalSettingsUseCase(repo)
    const listener = vi.fn()

    const unsubscribe = useCase.execute(listener)

    expect(spy).toHaveBeenCalledWith(listener)
    expect(typeof unsubscribe).toBe('function')

    const newSettings = createTestManagementGlobalSettings()
    repo.emit(newSettings)
    expect(listener).toHaveBeenCalledWith(newSettings)

    unsubscribe()
  })
})

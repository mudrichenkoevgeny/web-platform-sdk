import { describe, it, expect, vi } from 'vitest'
import { createTestManagementSecuritySettings } from '@mudrichenkoevgeny/shared-foundation'
import { ManagementSecuritySettingsRepositoryMock } from '@/mock/repository/security/settings/management-security-settings-repository-mock'
import { ObserveManagementSecuritySettingsUseCase } from './observe-management-security-settings-use-case'

describe('ObserveManagementSecuritySettingsUseCase', () => {
  it('delegates observer registration to repository and receives updates', () => {
    const repo = new ManagementSecuritySettingsRepositoryMock()
    const spy = vi.spyOn(repo, 'observeManagementSecuritySettings')
    const useCase = new ObserveManagementSecuritySettingsUseCase(repo)
    const listener = vi.fn()

    const unsubscribe = useCase.execute(listener)

    expect(spy).toHaveBeenCalledWith(listener)
    expect(typeof unsubscribe).toBe('function')

    const newSettings = createTestManagementSecuritySettings()
    repo.emit(newSettings)
    expect(listener).toHaveBeenCalledWith(newSettings)

    unsubscribe()
  })
})

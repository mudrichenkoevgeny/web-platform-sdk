import { describe, it, expect, vi } from 'vitest'
import { appResultFailure, CommonError, isSuccess } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { LogoutUseCase } from '@/usecase/session/logout-use-case'
import { SessionRepositoryMock } from '@/mock/repository/session/session-repository-mock'
import { UserRepositoryMock } from '@/mock/repository/user/user-repository-mock'

describe('LogoutUseCase', () => {
  it('clears local session even if remote logout fails', async () => {
    const mockSessionRepo = new SessionRepositoryMock()
    mockSessionRepo.logoutResultProvider = async () => appResultFailure(CommonError.network(new Error('Network error')))

    const mockUserRepo = new UserRepositoryMock()
    vi.spyOn(mockUserRepo, 'clearSession')

    const useCase = new LogoutUseCase(mockSessionRepo, mockUserRepo)
    const result = await useCase.execute()

    expect(isSuccess(result)).toBe(true)
    expect(mockUserRepo.clearSession).toHaveBeenCalled()
  })
})

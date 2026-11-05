import { describe, it, expect } from 'vitest'
import { PlatformRepositoryMock } from '@/mock/platform/platform-repository-mock'

describe('PlatformRepositoryMock', () => {
  it('PlatformRepositoryMock delegates to inner mocks', async () => {
    const repo = new PlatformRepositoryMock()
    const info = await repo.getClientDeviceInfo()
    expect(info.client_type).toBe('web')

    repo.openUrl('https://example.com')
    expect(repo.externalLauncherMock.openedUrls).toContain('https://example.com')
  })
})

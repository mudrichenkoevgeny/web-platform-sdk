import { describe, it, expect, vi } from 'vitest'
import { PlatformRepositoryImpl } from '@/platform/platform-repository'
import type { DeviceInfoProvider } from '@/platform/device-info/device-info-provider'
import type { ExternalLauncher } from '@/platform/external-launcher/external-launcher'
import { ClientType } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('PlatformRepository', () => {
  const dummyInfo: ClientDeviceInfoPayload = {
    client_type: ClientType.WEB,
    language: 'en',
    device_id: null,
    device_name: 'Chrome on macOS',
    app_version: '1.0.0',
    operation_system_version: 'macOS'
  }

  const mockDeviceInfoProvider: DeviceInfoProvider = {
    getDeviceInfo: vi.fn().mockResolvedValue(dummyInfo)
  }

  const mockExternalLauncher: ExternalLauncher = {
    openUrl: vi.fn(),
    openMail: vi.fn(),
    openFile: vi.fn()
  }

  it('delegates getDeviceInfo to DeviceInfoProvider', async () => {
    const repository = new PlatformRepositoryImpl(mockDeviceInfoProvider, mockExternalLauncher)
    const info = await repository.getDeviceInfo()

    expect(info).toEqual(dummyInfo)
    expect(mockDeviceInfoProvider.getDeviceInfo).toHaveBeenCalled()
  })

  it('delegates openUrl, openMail, openFile to ExternalLauncher', () => {
    const repository = new PlatformRepositoryImpl(mockDeviceInfoProvider, mockExternalLauncher)

    repository.openUrl('https://example.com')
    expect(mockExternalLauncher.openUrl).toHaveBeenCalledWith('https://example.com')

    repository.openMail('test@example.com', 'Subject', 'Body')
    expect(mockExternalLauncher.openMail).toHaveBeenCalledWith('test@example.com', 'Subject', 'Body')

    repository.openFile('https://example.com/doc.pdf')
    expect(mockExternalLauncher.openFile).toHaveBeenCalledWith('https://example.com/doc.pdf')
  })
})

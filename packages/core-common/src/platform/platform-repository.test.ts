import { describe, it, expect, vi } from 'vitest'
import { TEST_EMAIL } from '@mudrichenkoevgeny/shared-foundation'
import { PlatformRepositoryImpl } from '@/platform/platform-repository'
import type { ClientDeviceInfoProvider } from '@/platform/device-info/client-device-info-provider'
import type { ExternalLauncher } from '@/platform/external-launcher/external-launcher'
import { ClientType, CommonLocales } from '@mudrichenkoevgeny/shared-foundation'
import type { ClientDeviceInfoPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('PlatformRepository', () => {
  const mockDeviceInfoPayload: ClientDeviceInfoPayload = {
    client_type: ClientType.WEB,
    language: CommonLocales.ENGLISH,
    device_id: null,
    device_name: 'Chrome on macOS',
    app_version: '1.0.0',
    operation_system_version: 'macOS'
  }

  const mockClientDeviceInfoProvider: ClientDeviceInfoProvider = {
    getClientDeviceInfo: vi.fn().mockResolvedValue(mockDeviceInfoPayload)
  }

  const mockExternalLauncher: ExternalLauncher = {
    openUrl: vi.fn(),
    openMail: vi.fn(),
    openFile: vi.fn()
  }

  it('delegates getClientDeviceInfo to ClientDeviceInfoProvider', async () => {
    const repository = new PlatformRepositoryImpl(mockClientDeviceInfoProvider, mockExternalLauncher)
    const info = await repository.getClientDeviceInfo()

    expect(info).toEqual(mockDeviceInfoPayload)
    expect(mockClientDeviceInfoProvider.getClientDeviceInfo).toHaveBeenCalled()
  })

  it('delegates openUrl, openMail, openFile to ExternalLauncher', () => {
    const repository = new PlatformRepositoryImpl(mockClientDeviceInfoProvider, mockExternalLauncher)

    repository.openUrl('https://example.com')
    expect(mockExternalLauncher.openUrl).toHaveBeenCalledWith('https://example.com')

    repository.openMail(TEST_EMAIL, 'Subject', 'Body')
    expect(mockExternalLauncher.openMail).toHaveBeenCalledWith(TEST_EMAIL, 'Subject', 'Body')

    repository.openFile('https://example.com/doc.pdf')
    expect(mockExternalLauncher.openFile).toHaveBeenCalledWith('https://example.com/doc.pdf')
  })
})

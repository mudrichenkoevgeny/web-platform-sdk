import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClient } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import { ManagementSecuritySettingsRoutes } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSecuritySettingsApi', () => {
  let mockHttpClient: HttpClient
  let api: FetchManagementSecuritySettingsApi

  beforeEach(() => {
    mockHttpClient = {
      request: vi.fn()
    } as unknown as HttpClient
    api = new FetchManagementSecuritySettingsApi(mockHttpClient)
  })

  it('dispatches getManagementSecuritySettings request', async () => {
    const dummyPayload = { passwordPolicy: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.getManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.GET_MANAGEMENT_SECURITY_SETTINGS
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })

  it('dispatches updateManagementSecuritySettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const request = { passwordPolicy: {} } as any
    const result = await api.updateManagementSecuritySettings(request)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.UPDATE_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(request) })
    )
    expect(result).toEqual({ data: undefined, kind: 'Success' })
  })

  it('dispatches resetManagementSecuritySettings request', async () => {
    const dummyPayload = { passwordPolicy: {} } as any
    vi.mocked(mockHttpClient.request).mockResolvedValue(dummyPayload)

    const result = await api.resetManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.RESET_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(result).toEqual({ data: dummyPayload, kind: 'Success' })
  })
})

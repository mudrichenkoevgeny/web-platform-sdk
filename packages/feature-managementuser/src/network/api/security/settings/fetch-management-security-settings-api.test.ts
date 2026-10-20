import { describe, it, expect, vi, beforeEach } from 'vitest'
import { HttpClientMock } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { FetchManagementSecuritySettingsApi } from '@/network/api/security/settings/fetch-management-security-settings-api'
import { ManagementSecuritySettingsRoutes, createTestManagementSecuritySettingsPayload } from '@mudrichenkoevgeny/shared-foundation'

describe('FetchManagementSecuritySettingsApi', () => {
  let mockHttpClient: HttpClientMock
  let api: FetchManagementSecuritySettingsApi

  beforeEach(() => {
    mockHttpClient = new HttpClientMock()
    vi.spyOn(mockHttpClient, 'request')
    api = new FetchManagementSecuritySettingsApi(mockHttpClient)
  })

  it('dispatches getManagementSecuritySettings request', async () => {
    const mockSecuritySettingsPayload = createTestManagementSecuritySettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSecuritySettingsPayload)

    const securitySettingsResult = await api.getManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.GET_MANAGEMENT_SECURITY_SETTINGS
    )
    expect(securitySettingsResult).toEqual({ success: true, data: mockSecuritySettingsPayload })
  })

  it('dispatches updateManagementSecuritySettings request', async () => {
    vi.mocked(mockHttpClient.request).mockResolvedValue(undefined)

    const updateSecuritySettingsRequest = createTestManagementSecuritySettingsPayload()
    const updateSecuritySettingsResult = await api.updateManagementSecuritySettings(updateSecuritySettingsRequest)

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.UPDATE_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'PUT', body: JSON.stringify(updateSecuritySettingsRequest) })
    )
    expect(updateSecuritySettingsResult).toEqual({ success: true, data: undefined })
  })

  it('dispatches resetManagementSecuritySettings request', async () => {
    const mockSecuritySettingsPayload = createTestManagementSecuritySettingsPayload()
    vi.mocked(mockHttpClient.request).mockResolvedValue(mockSecuritySettingsPayload)

    const resetSecuritySettingsResult = await api.resetManagementSecuritySettings()

    expect(mockHttpClient.request).toHaveBeenCalledWith(
      ManagementSecuritySettingsRoutes.RESET_MANAGEMENT_SECURITY_SETTINGS,
      expect.objectContaining({ method: 'POST' })
    )
    expect(resetSecuritySettingsResult).toEqual({ success: true, data: mockSecuritySettingsPayload })
  })
})

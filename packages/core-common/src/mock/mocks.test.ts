import { describe, it, expect, vi } from 'vitest'
import { AppErrorParserMock } from './error/AppErrorParserMock'
import { AccessTokenProviderMock } from './network/AccessTokenProviderMock'
import { HttpClientConfigPluginMock } from './network/HttpClientConfigPluginMock'
import { WebSocketServiceMock } from './network/WebSocketServiceMock'
import { DeviceInfoProviderMock } from './platform/DeviceInfoProviderMock'
import { ExternalLauncherMock } from './platform/ExternalLauncherMock'
import { PlatformRepositoryMock } from './platform/PlatformRepositoryMock'
import { CommonStorageMock } from './storage/CommonStorageMock'
import { EncryptedSettingsMock } from './storage/EncryptedSettingsMock'
import { createMockCommonComponent } from './di/CommonComponentMock'
import { CommonError } from '../error/model/CommonError'

describe('Domain Mocks', () => {
  it('AppErrorParserMock parses registered codes and fallback', () => {
    const parser = new AppErrorParserMock('Default Fallback')
    parser.mockParseForCode('UNKNOWN', 'Custom Unknown')

    expect(parser.parse(CommonError.unknown())).toBe('Custom Unknown')
    expect(parser.parse(CommonError.network('err'))).toBe('Default Fallback')
  })

  it('AccessTokenProviderMock manages token and notifies listeners', () => {
    const provider = new AccessTokenProviderMock('initial')
    const listener = vi.fn()
    const unsubscribe = provider.observeAccessToken(listener)

    expect(provider.getAccessToken()).toBe('initial')
    provider.setAccessToken('new-token')

    expect(listener).toHaveBeenCalledWith('new-token')
    expect(provider.getAccessToken()).toBe('new-token')

    unsubscribe()
    provider.setAccessToken('another-token')
    expect(listener).toHaveBeenCalledTimes(1)
  })

  it('HttpClientConfigPluginMock records request and response', async () => {
    const plugin = new HttpClientConfigPluginMock()
    const init: RequestInit = { method: 'GET' }
    const response = new Response('ok', { status: 200 })

    await plugin.onRequest('https://api.example.com/test', init)
    await plugin.onResponse(response)

    expect(plugin.onRequestCallCount).toBe(1)
    expect(plugin.lastRequestUrl).toBe('https://api.example.com/test')
    expect(plugin.onResponseCallCount).toBe(1)
    expect(plugin.lastResponse).toBe(response)
  })

  it('WebSocketServiceMock manages connect, frame sending and local emission', async () => {
    const service = new WebSocketServiceMock()
    const listener = vi.fn()
    service.observeEvents(listener)

    service.connect()
    expect(service.isConnected).toBe(true)

    await service.sendPing()
    expect(service.sentFrames.length).toBe(1)
    expect(service.sentFrames[0]!.type).toBe('PING')

    service.emitFrameLocally(service.sentFrames[0]!)
    expect(listener).toHaveBeenCalledWith(service.sentFrames[0])

    service.disconnect()
    expect(service.isConnected).toBe(false)
  })

  it('DeviceInfoProviderMock returns configured mock device payload', async () => {
    const provider = new DeviceInfoProviderMock({ app_version: '3.0.0' })
    const info = await provider.getDeviceInfo()

    expect(info.client_type).toBe('WEB')
    expect(info.app_version).toBe('3.0.0')
  })

  it('ExternalLauncherMock logs launch calls', () => {
    const launcher = new ExternalLauncherMock()
    launcher.openUrl('https://example.com')
    launcher.openMail('test@example.com', 'Subj', 'Body')
    launcher.openFile('https://example.com/file.pdf')

    expect(launcher.openedUrls).toEqual(['https://example.com'])
    expect(launcher.openedMails).toEqual([{ email: 'test@example.com', subject: 'Subj', body: 'Body' }])
    expect(launcher.openedFiles).toEqual(['https://example.com/file.pdf'])
  })

  it('PlatformRepositoryMock delegates to inner mocks', async () => {
    const repo = new PlatformRepositoryMock()
    const info = await repo.getDeviceInfo()
    expect(info.client_type).toBe('WEB')

    repo.openUrl('https://example.com')
    expect(repo.externalLauncherMock.openedUrls).toContain('https://example.com')
  })

  it('CommonStorageMock stores and clears deviceId', async () => {
    const storage = new CommonStorageMock()
    expect(await storage.getDeviceId()).toBeNull()

    await storage.updateDeviceId('dev-1')
    expect(await storage.getDeviceId()).toBe('dev-1')

    await storage.clear()
    expect(await storage.getDeviceId()).toBeNull()
  })

  it('EncryptedSettingsMock puts, gets, removes and observes key changes', async () => {
    const settings = new EncryptedSettingsMock()
    const listener = vi.fn()
    const unsubscribe = settings.observe('testKey', listener)

    await settings.put('testKey', 'testVal')
    expect(await settings.get('testKey')).toBe('testVal')
    expect(listener).toHaveBeenCalledWith('testVal')

    await settings.remove('testKey')
    expect(await settings.get('testKey')).toBeNull()
    expect(listener).toHaveBeenCalledWith(null)

    unsubscribe()
  })

  it('createMockCommonComponent creates an initialized CommonComponent instance', () => {
    const component = createMockCommonComponent()
    expect(component).toBeDefined()
    expect(component.appErrorParser).toBeDefined()
  })
})

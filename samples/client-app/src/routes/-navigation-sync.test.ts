import { describe, it, expect } from 'vitest'
import { createRouter } from '@tanstack/react-router'
import {
  ClientAuthNavigation,
  ClientUserNavigation,
  OpenStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockStorageComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { clientUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { ClientAppComponent } from '@/di/client-app-component'
import { routeTree } from '../routeTree.gen'
import type { RouterDIContext } from './__root'

const createMockRouterContext = (): RouterDIContext => {
  const commonComponent = createMockCommonComponent()
  const settingsComponent = createMockSettingsComponent()
  const securityComponent = createMockSecurityComponent()
  const storageComponent = createMockStorageComponent()
  const clientUserComponent = clientUserComponentMock()

  const appComponent = new ClientAppComponent({
    baseUrl: 'http://localhost:8080',
    mockCommonComponent: commonComponent,
    mockSettingsComponent: settingsComponent,
    mockSecurityComponent: securityComponent,
    mockStorageComponent: storageComponent,
    mockClientUserComponent: clientUserComponent
  })

  return {
    appComponent
  }
}

const normalizeRoutePath = (route: string): string =>
  route === '/' ? '/' : route.replace(/\/$/, '').replace(/\{([^}]+)\}/g, '$$$1')

describe('Navigation Constants Sync', () => {
  it('should match TanStack generated routes with shared navigation constants for Client App', () => {
    const context = createMockRouterContext()
    const router = createRouter({ routeTree, context })
    const registeredPaths = Object.keys(router.routesByPath || {})
    const normalizedRegistered = registeredPaths.map((p) => (p === '/' ? '/' : p.replace(/\/$/, '')))

    const expectedNavigationRoutes = [
      ClientAuthNavigation.Main.ROUTE,
      ClientAuthNavigation.LoginByEmail.ROUTE,
      ClientAuthNavigation.LoginByPhone.ROUTE,
      ClientAuthNavigation.LoginByTotp.ROUTE,
      ClientAuthNavigation.PendingDeletion.ROUTE,
      ClientAuthNavigation.Registration.ROUTE,
      ClientAuthNavigation.ResetPassword.ROUTE,
      ClientAuthNavigation.UnlockMethodSelection.ROUTE,
      ClientUserNavigation.Main.route,
      ClientUserNavigation.IdentifierList.ROUTE,
      ClientUserNavigation.SessionList.ROUTE,
      ClientUserNavigation.TotpMain.ROUTE,
      OpenStorageNavigation.Main.route,
      OpenStorageNavigation.FileList.ROUTE,
      OpenStorageNavigation.FileDetail.ROUTE,
      OpenStorageNavigation.FileUpload.ROUTE
    ]

    expectedNavigationRoutes.forEach((route) => {
      if (route) {
        const normalizedRoute = normalizeRoutePath(route)
        expect(normalizedRegistered).toContain(normalizedRoute)
      }
    })
  })
})

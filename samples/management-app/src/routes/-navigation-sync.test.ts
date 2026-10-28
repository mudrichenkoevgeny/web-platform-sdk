import { describe, it, expect } from 'vitest'
import { createRouter } from '@tanstack/react-router'
import {
  CompositeAuditActionTypeParser,
  CompositeAuditMetadataKeyParser,
  CompositeAuditResourceTypeParser,
  ManagementAuthNavigation,
  ManagementMainNavigation,
  ManagementStorageNavigation,
  ManagementSelfStorageNavigation,
  ManagementAuthSettingsNavigation,
  ManagementSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementStorageSettingsNavigation,
  ManagementSelfUserNavigation
} from '@mudrichenkoevgeny/shared-foundation'
import { createMockCommonComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createMockSettingsComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-settings'
import { createMockSecurityComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-security'
import { createMockStorageComponent } from '@mudrichenkoevgeny/web-platform-sdk-core-storage'
import { managementUserComponentMock } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { ManagementAppComponent } from '@/di/management-app-component'
import { routeTree } from '../routeTree.gen'
import type { RouterDIContext } from './__root'

const createMockRouterContext = (): RouterDIContext => {
  const commonComponent = createMockCommonComponent()
  const settingsComponent = createMockSettingsComponent()
  const securityComponent = createMockSecurityComponent()
  const storageComponent = createMockStorageComponent()
  const managementUserComponent = managementUserComponentMock()

  const appComponent = new ManagementAppComponent({
    baseUrl: 'http://localhost:9091',
    compositeActionTypeParser: new CompositeAuditActionTypeParser([]),
    compositeResourceTypeParser: new CompositeAuditResourceTypeParser([]),
    compositeMetadataKeyParser: new CompositeAuditMetadataKeyParser([]),
    mockCommonComponent: commonComponent,
    mockSettingsComponent: settingsComponent,
    mockSecurityComponent: securityComponent,
    mockStorageComponent: storageComponent,
    mockManagementUserComponent: managementUserComponent
  })

  return {
    appComponent,
    managementDeps: managementUserComponent.rootStoreDependencies
  }
}

const normalizeRoutePath = (route: string): string =>
  route === '/'
    ? '/'
    : route
        .replace(/^\$/, '')
        .replace(/\/$/, '')
        .replace(/\{([^}]+)\}/g, '$$$1')

describe('Navigation Constants Sync', () => {
  it('should match TanStack generated routes with shared navigation constants for Management App', () => {
    const context = createMockRouterContext()
    const router = createRouter({ routeTree, context })
    const registeredPaths = Object.keys(router.routesByPath || {})
    const normalizedRegistered = registeredPaths.map((p) => (p === '/' ? '/' : p.replace(/\/$/, '')))

    const expectedNavigationRoutes = [
      ManagementMainNavigation.Main.route,
      ManagementAuthNavigation.Main.ROUTE,
      ManagementAuthNavigation.LoginByEmail.ROUTE,
      ManagementAuthNavigation.LoginByTotp.ROUTE,
      ManagementAuthNavigation.ResetPassword.ROUTE,
      ManagementAuthNavigation.UnlockMethodSelection.ROUTE,
      ManagementStorageNavigation.Main.route,
      ManagementStorageNavigation.FileList.ROUTE,
      ManagementStorageNavigation.FileDetail.ROUTE,
      ManagementSelfStorageNavigation.Main.route,
      ManagementSelfStorageNavigation.FileList.ROUTE,
      ManagementSelfStorageNavigation.FileDetail.ROUTE,
      ManagementSelfStorageNavigation.FileUpload.ROUTE,
      ManagementAuthSettingsNavigation.AuthSettings.route,
      ManagementSettingsNavigation.GlobalSettings.route,
      ManagementSecurityNavigation.SecuritySettings.route,
      ManagementStorageSettingsNavigation.StorageSettings.route,
      ManagementSelfUserNavigation.Main.route,
      ManagementSelfUserNavigation.IdentifierList.ROUTE,
      ManagementSelfUserNavigation.SessionList.ROUTE
    ]

    expectedNavigationRoutes.forEach((route) => {
      if (route) {
        const normalizedRoute = normalizeRoutePath(route)
        expect(normalizedRegistered).toContain(normalizedRoute)
      }
    })
  })
})

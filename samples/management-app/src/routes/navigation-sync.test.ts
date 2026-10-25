import { describe, it, expect } from 'vitest'
import {
  ManagementAuthNavigation,
  ManagementMainNavigation,
  ManagementStorageNavigation,
  ManagementAuthSettingsNavigation,
  ManagementSettingsNavigation,
  ManagementSecurityNavigation,
  ManagementStorageSettingsNavigation,
  ManagementSelfUserNavigation
} from '@mudrichenkoevgeny/shared-foundation'
import { routeTree } from '../routeTree.gen'
import type { AnyRoute } from '@tanstack/react-router'

const normalizeKmpRoute = (route: string): string =>
  route === '/' ? '/' : route.replace(/\/$/, '').replace(/\{([^}]+)\}/g, '$$$1')

describe('Navigation Constants Sync', () => {
  it('should match TanStack generated routes with KMP constants for Management App', () => {
    const registeredPaths = new Set<string>()

    const extractPaths = (route: AnyRoute) => {
      if (route.fullPath) {
        registeredPaths.add(route.fullPath)
      }
      if (route.children) {
        Object.values(route.children).forEach(extractPaths as any)
      }
    }
    extractPaths(routeTree as any)

    const normalizedRegistered = Array.from(registeredPaths).map(p => (p === '/' ? '/' : p.replace(/\/$/, '')))

    const kmpRoutes = [
      ManagementMainNavigation.Main.route,
      ManagementAuthNavigation.Main.ROUTE,
      ManagementAuthNavigation.LoginByEmail.ROUTE,
      ManagementAuthNavigation.LoginByTotp.ROUTE,
      ManagementAuthNavigation.PendingDeletion.ROUTE,
      ManagementAuthNavigation.ResetPassword.ROUTE,
      ManagementAuthNavigation.UnlockMethodSelection.ROUTE,
      ManagementStorageNavigation.FileList.ROUTE,
      ManagementStorageNavigation.FileUpload.route,
      ManagementStorageNavigation.FileDetail.ROUTE,
      ManagementAuthSettingsNavigation.AuthSettings.route,
      ManagementSettingsNavigation.GlobalSettings.route,
      ManagementSecurityNavigation.SecuritySettings.route,
      ManagementStorageSettingsNavigation.StorageSettings.route,
      ManagementSelfUserNavigation.Main.route,
      ManagementSelfUserNavigation.IdentifierList.ROUTE,
      ManagementSelfUserNavigation.SessionList.ROUTE
    ]

    kmpRoutes.forEach((route) => {
      if (route) {
        const normalizedRoute = normalizeKmpRoute(route)
        expect(normalizedRegistered).toContain(normalizedRoute)
      }
    })
  })
})

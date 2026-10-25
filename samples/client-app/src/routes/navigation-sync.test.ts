import { describe, it, expect } from 'vitest'
import {
  ClientAuthNavigation,
  ClientUserNavigation,
  OpenStorageNavigation
} from '@mudrichenkoevgeny/shared-foundation'
import { routeTree } from '../routeTree.gen'
import type { AnyRoute } from '@tanstack/react-router'

const normalizeKmpRoute = (route: string): string =>
  route === '/' ? '/' : route.replace(/\/$/, '').replace(/\{([^}]+)\}/g, '$$$1')

describe('Navigation Constants Sync', () => {
  it('should match TanStack generated routes with KMP constants for Client App', () => {
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
      OpenStorageNavigation.FileList.ROUTE,
      OpenStorageNavigation.FileUpload.route,
      OpenStorageNavigation.FileDetail.ROUTE
    ]

    kmpRoutes.forEach((route) => {
      if (route) {
        const normalizedRoute = normalizeKmpRoute(route)
        expect(normalizedRegistered).toContain(normalizedRoute)
      }
    })
  })
})

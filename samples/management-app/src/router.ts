import { createRouter } from '@tanstack/react-router'
import { routeTree } from './routeTree.gen'
import type { ManagementRootStoreDependencies, ManagementLoginRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'

export interface RouterDIContext {
  managementDeps: ManagementRootStoreDependencies
  loginDependencies: ManagementLoginRootStoreDependencies
}

export const router = createRouter({
  routeTree,
  context: {
    managementDeps: undefined!,
    loginDependencies: undefined!
  }
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

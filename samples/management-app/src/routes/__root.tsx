import { createRootRouteWithContext } from '@tanstack/react-router'
import type { ManagementAppComponent } from '@/di/management-app-component'
import type { ManagementRootStoreDependencies, ManagementLoginRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { MainScreen } from '@/ui/screen/main/MainScreen'

export interface RouterDIContext {
  appComponent: ManagementAppComponent
  managementDeps: ManagementRootStoreDependencies
  loginDependencies: ManagementLoginRootStoreDependencies
}

export const Route = createRootRouteWithContext<RouterDIContext>()({
  component: MainScreen
})

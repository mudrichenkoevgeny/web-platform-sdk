import { createRootRouteWithContext } from '@tanstack/react-router'
import type { ManagementAppComponent } from '@/di/management-app-component'
import type { ManagementRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-managementuser'
import { MainScreen } from '@/ui/screen/main/MainScreen'

export interface RouterDIContext {
  appComponent: ManagementAppComponent
  managementDeps: ManagementRootStoreDependencies
}

export const Route = createRootRouteWithContext<RouterDIContext>()({
  component: MainScreen
})

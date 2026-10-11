import { createRootRouteWithContext } from '@tanstack/react-router'
import type { ClientAppComponent } from '@/di/client-app-component'
import type { ClientLoginRootStoreDependencies } from '@mudrichenkoevgeny/web-platform-sdk-feature-clientuser'
import { MainScreen } from '@/ui/screen/main/MainScreen'

export interface RouterDIContext {
  appComponent: ClientAppComponent
  loginDependencies: ClientLoginRootStoreDependencies
}

export const Route = createRootRouteWithContext<RouterDIContext>()({
  component: MainScreen
})

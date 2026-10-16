import { createRootRouteWithContext } from '@tanstack/react-router'
import type { ClientAppComponent } from '@/di/client-app-component'
import { MainScreen } from '@/ui/screen/main/MainScreen'

export interface RouterDIContext {
  appComponent: ClientAppComponent
}

export const Route = createRootRouteWithContext<RouterDIContext>()({
  component: MainScreen
})

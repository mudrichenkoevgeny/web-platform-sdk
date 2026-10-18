import React from 'react'
import type { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

export type MainTabKey = 'management' | 'user'

export interface MainScreenDestination {
  key: MainTabKey
  label: (strings: UserModuleStrings) => string
  Icon: React.ComponentType<{ className?: string }>
}

export const mainScreenDestinations: Record<MainTabKey, MainScreenDestination> = {
  management: {
    key: 'management',
    label: (strings) => strings.ui.managementSettingsTitle,
    Icon: icons.home
  },
  user: {
    key: 'user',
    label: (strings) => strings.ui.user,
    Icon: icons.user
  }
}

export function getDestinations(isAuthorized: boolean): MainScreenDestination[] {
  if (isAuthorized) {
    return [
      mainScreenDestinations.management,
      mainScreenDestinations.user
    ]
  }
  return [
    mainScreenDestinations.management
  ]
}

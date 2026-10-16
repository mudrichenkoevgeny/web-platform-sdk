import React from 'react'
import { icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementAppStrings } from '@/locales/index'

export type MainTabKey = 'management' | 'user'

export interface MainScreenDestination {
  key: MainTabKey
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

export const mainScreenDestinations: Record<MainTabKey, MainScreenDestination> = {
  management: {
    key: 'management',
    label: enManagementAppStrings.nav_management,
    Icon: icons.home
  },
  user: {
    key: 'user',
    label: enManagementAppStrings.nav_user,
    Icon: icons.profile
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

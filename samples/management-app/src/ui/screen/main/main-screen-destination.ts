import React from 'react'
import { icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementAppStrings } from '@/locales/index'

export type MainTabKey = 'home' | 'profile' | 'settings'

export interface MainScreenDestination {
  key: MainTabKey
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

export const mainScreenDestinations: Record<MainTabKey, MainScreenDestination> = {
  home: {
    key: 'home',
    label: enManagementAppStrings.nav_home,
    Icon: icons.home
  },
  profile: {
    key: 'profile',
    label: enManagementAppStrings.nav_profile,
    Icon: icons.profile
  },
  settings: {
    key: 'settings',
    label: enManagementAppStrings.nav_settings,
    Icon: icons.settings
  }
}

export function getDestinations(isAuthorized: boolean): MainScreenDestination[] {
  if (isAuthorized) {
    return [
      mainScreenDestinations.home,
      mainScreenDestinations.profile,
      mainScreenDestinations.settings
    ]
  }
  return [
    mainScreenDestinations.home,
    mainScreenDestinations.profile
  ]
}

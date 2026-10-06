import React from 'react'
import { icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enClientAppStrings } from '@/locales/index'

export type MainTabKey = 'home' | 'profile'

export interface MainScreenDestination {
  key: MainTabKey
  label: string
  Icon: React.ComponentType<{ className?: string }>
}

export const mainScreenDestinations: MainScreenDestination[] = [
  {
    key: 'home',
    label: enClientAppStrings.nav_home,
    Icon: icons.home
  },
  {
    key: 'profile',
    label: enClientAppStrings.nav_profile,
    Icon: icons.profile
  }
]

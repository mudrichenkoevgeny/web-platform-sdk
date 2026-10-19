import React from 'react'
import { userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { icons } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** Available main navigation tab keys. */
export type MainTabKey = 'management' | 'user'

/** Destination configuration for a main navigation tab. */
export interface MainScreenDestination {
  /** Unique tab key. */
  key: MainTabKey
  /** Localized tab label. */
  label: string
  /** Icon component associated with the tab. */
  Icon: React.ComponentType<{ className?: string }>
}

/** Mapping of all available main navigation destinations. */
export const mainScreenDestinations: Record<MainTabKey, MainScreenDestination> = {
  management: {
    key: 'management',
    get label() {
      return userStrings.ui.managementSettingsTitle
    },
    Icon: icons.home
  },
  user: {
    key: 'user',
    get label() {
      return userStrings.ui.user
    },
    Icon: icons.user
  }
}

/**
 * Resolves active navigation destinations based on user authorization status.
 *
 * @param isAuthorized - Whether the current user is authorized
 * @returns Array of active {@link MainScreenDestination} items
 */
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

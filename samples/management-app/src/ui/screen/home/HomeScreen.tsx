import React from 'react'
import { UserModuleStrings } from '@mudrichenkoevgeny/shared-foundation'

const userStrings = new UserModuleStrings()

export const HomeScreenTestTags = {
  TITLE: 'HomeScreen_Title'
}

/**
 * Placeholder home tab content for the sample management app.
 */
export function HomeScreen(): React.JSX.Element {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <h1 data-testid={HomeScreenTestTags.TITLE} className="text-xl font-semibold">
        {userStrings.ui.managementSettingsTitle}
      </h1>
    </div>
  )
}

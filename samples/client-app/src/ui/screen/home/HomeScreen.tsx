import React from 'react'
import { CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'

const defaultCommonStrings = new CommonModuleStrings()

export const HomeScreenTestTags = {
  TITLE: 'HomeScreen_Title'
}

/**
 * Placeholder home tab content for the sample.
 */
export function HomeScreen(): React.JSX.Element {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <h1 data-testid={HomeScreenTestTags.TITLE} className="text-xl font-semibold">
        {defaultCommonStrings.ui.user}
      </h1>
    </div>
  )
}

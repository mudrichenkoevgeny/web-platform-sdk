import React from 'react'
import { commonStrings } from '@mudrichenkoevgeny/shared-foundation'

/** Automation test tags for {@link HomeScreen}. */
export const HomeScreenTestTags = {
  TITLE: 'HomeScreen_Title'
}

/**
 * Placeholder home tab content for the sample client application.
 *
 * @returns JSX Element rendering home screen content
 */
export function HomeScreen(): React.JSX.Element {
  return (
    <div className="w-full h-full flex items-center justify-center p-6">
      <h1 data-testid={HomeScreenTestTags.TITLE} className="text-xl font-semibold">
        {commonStrings.ui.user}
      </h1>
    </div>
  )
}

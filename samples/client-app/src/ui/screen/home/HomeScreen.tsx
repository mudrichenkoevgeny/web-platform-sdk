import React from 'react'
import { enClientAppStrings } from '@/locales/index'

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
        {enClientAppStrings.home_screen_title}
      </h1>
    </div>
  )
}

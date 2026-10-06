import React from 'react'
import { FullscreenLoading } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Displayed during initial application bootstrapping and SDK initialization.
 */
export function InitialLoader(): React.JSX.Element {
  return <FullscreenLoading delayMillis={0} />
}

import React from 'react'

export type CoreScrollbarProps = React.HTMLAttributes<HTMLDivElement>

export const CoreVerticalScrollbar: React.FC<CoreScrollbarProps> = () => {
  return null
}

CoreVerticalScrollbar.displayName = 'CoreVerticalScrollbar'

export const CoreLazyColumnScrollbar = CoreVerticalScrollbar

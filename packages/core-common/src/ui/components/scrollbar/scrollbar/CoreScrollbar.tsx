import React from 'react'

export interface CoreScrollbarProps extends React.HTMLAttributes<HTMLDivElement> {}

export const CoreVerticalScrollbar: React.FC<CoreScrollbarProps> = () => {
  return null
}

CoreVerticalScrollbar.displayName = 'CoreVerticalScrollbar'

export const CoreLazyColumnScrollbar = CoreVerticalScrollbar

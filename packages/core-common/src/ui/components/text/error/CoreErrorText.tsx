import React, { forwardRef } from 'react'
import { cn } from '../../../../utils/cn'

export interface CoreErrorTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  text: string
}

export const CoreErrorText = forwardRef<HTMLParagraphElement, CoreErrorTextProps>(
  ({ text, className, ...rest }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-xs font-medium text-error', className)}
        {...rest}
      >
        {text}
      </p>
    )
  }
)

CoreErrorText.displayName = 'CoreErrorText'

import React, { forwardRef } from 'react'
import type { AppError } from '@/error/model/app-error'
import { useAppErrorParser } from '@/context/SdkProvider'
import { CoreButton } from '@/ui/components/button/button/CoreButton'
import { CoreBackButton } from '@/ui/components/button/back/CoreBackButton'
import { CoreScreenTitleText } from '@/ui/components/text/screen-title/CoreScreenTitleText'
import { enStrings } from '@/locales/en/strings'
import type { CoreCommonStrings } from '@/locales/en/strings'
import { cn } from '@/utils/cn'
import { CoreIcon } from '@/ui/components/icon/icon/CoreIcon'
import { icons } from '@/assets/icons/index.js'

export interface FullscreenErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  error: AppError
  onRetry: () => void
  onBack?: () => void
  title?: string
  strings?: CoreCommonStrings
}

export const FullscreenError = forwardRef<HTMLDivElement, FullscreenErrorProps>(
  ({ error, onRetry, onBack, title, strings = enStrings, className, ...rest }, ref) => {
    const errorParser = useAppErrorParser()
    const message = errorParser.parse(error) ?? error.code

    return (
      <div
        ref={ref}
        className={cn(
          'h-full w-full flex flex-col p-6 relative overflow-hidden',
          className
        )}
        {...rest}
      >
        {onBack && (
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton onClick={onBack} />
            {title && (
              <CoreScreenTitleText
                text={title}
                className="absolute left-1/2 -translate-x-1/2"
              />
            )}
          </div>
        )}

        <div className="flex-1 w-full flex flex-col items-center justify-center p-6 text-center gap-4">
          <CoreIcon src={icons.warning} size={48} className="text-error" />

          <p className="text-base text-surface-foreground max-w-core-button">
            {message}
          </p>

          {error.isRetryable && (
            <CoreButton onClick={onRetry} label={strings.retry} />
          )}
        </div>
      </div>
    )
  }
)

FullscreenError.displayName = 'FullscreenError'

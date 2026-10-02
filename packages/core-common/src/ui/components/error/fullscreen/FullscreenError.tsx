import { forwardRef } from 'react'
import { AppError } from '../../../../error/model/AppError'
import { useAppErrorParser } from '../../../../context/SdkProvider'
import { CoreButton } from '../../button/button/CoreButton'
import { enStrings } from '../../../../locales/en/strings'
import { cn } from '../../../../utils/cn'
import { CoreIcon } from '../../icon/icon/CoreIcon'
import { icons } from '../../../../assets/icons/index.js'

export interface FullscreenErrorProps extends React.HTMLAttributes<HTMLDivElement> {
  error: AppError
  onRetry: () => void
}

export const FullscreenError = forwardRef<HTMLDivElement, FullscreenErrorProps>(
  ({ error, onRetry, className, ...rest }, ref) => {
    const errorParser = useAppErrorParser()
    const message = errorParser.parse(error) ?? error.code

    return (
      <div
        ref={ref}
        className={cn(
          'h-full w-full flex flex-col items-center justify-center p-6 text-center gap-4',
          className
        )}
        {...rest}
      >
        <CoreIcon src={icons.warning} size={48} className="text-error" />

        <p className="text-base text-surface-foreground max-w-core-button">
          {message}
        </p>

        {error.isRetryable && (
          <CoreButton onClick={onRetry} label={enStrings.retry} />
        )}
      </div>
    )
  }
)

FullscreenError.displayName = 'FullscreenError'

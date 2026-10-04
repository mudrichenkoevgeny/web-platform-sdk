import React, { forwardRef, useState } from 'react'
import {
  cn,
  CoreCodeTextField,
  CoreTextButton,
  CoreScreenTitleText
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings, FeatureUserStrings } from '@/locales/index'
import { MfaChallengeRequest } from '@/network/httpclient/mfa/MfaChallengeRequest'

export interface MfaChallengeDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onConfirm'> {
  request: MfaChallengeRequest
  onConfirm: (code: string) => void
  onCancel: () => void
  strings?: FeatureUserStrings
}

export const MfaChallengeDialog = forwardRef<HTMLDivElement, MfaChallengeDialogProps>(
  (
    {
      request,
      onConfirm,
      onCancel,
      strings = enUserStrings,
      className,
      ...rest
    },
    ref
  ) => {
    const [code, setCode] = useState('')

    const handleConfirm = (e?: React.FormEvent) => {
      e?.preventDefault()
      if (code.trim()) {
        onConfirm(code.trim())
      }
    }

    return (
      <div
        ref={ref}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mfa-dialog-title"
        className={cn(
          'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4',
          className
        )}
        {...rest}
      >
        <form
          onSubmit={handleConfirm}
          className="bg-card text-card-foreground border border-border rounded-xl shadow-lg max-w-md w-full p-6 flex flex-col gap-4"
        >
          <CoreScreenTitleText text={strings.mfa_step_up_title} id="mfa-dialog-title" />

          <p className="text-sm text-muted-foreground">
            {strings.mfa_step_up_desc}
          </p>

          <CoreCodeTextField
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label={strings.totp_code}
            placeholder={strings.totp_code}
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <CoreTextButton
              type="button"
              label={strings.cancel}
              onClick={onCancel}
            />
            <CoreTextButton
              type="submit"
              label={strings.confirm}
              disabled={!code.trim()}
              onClick={handleConfirm}
            />
          </div>
        </form>
      </div>
    )
  }
)

MfaChallengeDialog.displayName = 'MfaChallengeDialog'

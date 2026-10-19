import React, { forwardRef, useState } from 'react'
import { UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreCodeTextField,
  CoreTextButton,
  CoreScreenTitleText
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import type { MfaChallengeRequest } from '@/network/httpclient/mfa/mfa-challenge-request'

export interface MfaChallengeDialogProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onConfirm'> {
  request: MfaChallengeRequest
  onConfirm: (code: string) => void
  onCancel: () => void
  strings?: UserModuleStrings
}

export const MfaChallengeDialog = forwardRef<HTMLDivElement, MfaChallengeDialogProps>(
  (
    {
      request: _request,
      onConfirm,
      onCancel,
      strings = userStrings,
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
          <CoreScreenTitleText text={strings.ui.mfaStepUpTitle} id="mfa-dialog-title" />

          <p className="text-sm text-muted-foreground">
            {strings.ui.mfaStepUpDesc}
          </p>

          <CoreCodeTextField
            value={code}
            onChange={(e) => setCode(e.target.value)}
            label={strings.ui.totpCode}
            placeholder={strings.ui.totpCode}
            autoFocus
          />

          <div className="flex items-center justify-end gap-2 pt-2">
            <CoreTextButton
              type="button"
              label={strings.ui.cancel}
              onClick={onCancel}
            />
            <CoreTextButton
              type="submit"
              label={strings.ui.confirm}
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

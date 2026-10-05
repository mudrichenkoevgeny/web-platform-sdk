import React, { forwardRef } from 'react'
import { UnlockMethod } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from '@/locales/index'
import { UnlockMethodSelectionScreen } from '@/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen'
import { UnlockTargetInputScreen } from '@/ui/screens/auth/unlock/target/UnlockTargetInputScreen'
import { UnlockOtpScreen } from '@/ui/screens/auth/unlock/otp/UnlockOtpScreen'
import { UnlockSuccessScreen } from '@/ui/screens/auth/unlock/success/UnlockSuccessScreen'
import {
  UnlockRootProvider,
  useUnlockRootStore
} from '@/ui/screens/auth/unlock/root/unlock-root-store'
import type { UnlockRootStoreDependencies } from '@/ui/screens/auth/unlock/root/unlock-root-store'

const UnlockRootContent: React.FC<{
  dependencies: UnlockRootStoreDependencies
  strings?: FeatureUserStrings
}> = ({ dependencies, strings = enUserStrings }) => {
  const stack = useUnlockRootStore((s) => s.stack)
  const push = useUnlockRootStore((s) => s.push)
  const pop = useUnlockRootStore((s) => s.pop)

  const currentDestination = stack[stack.length - 1]

  if (!currentDestination) {
    return null
  }

  switch (currentDestination.type) {
    case 'selection':
      return (
        <UnlockMethodSelectionScreen
          dependencies={{
            lockoutType: dependencies.lockoutType ?? null,
            lockoutUntil: dependencies.lockoutUntil ?? null,
            getUserIdentifiersUseCase: dependencies.getUserIdentifiersUseCase,
            unlockByGoogleUseCase: dependencies.unlockByGoogleUseCase,
            onNavigateToEmailInput: () => push({ type: 'target_input', method: UnlockMethod.EMAIL }),
            onNavigateToPhoneInput: () => push({ type: 'target_input', method: UnlockMethod.PHONE }),
            onUnlockSuccess: () => push({ type: 'success' }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'target_input':
      return (
        <UnlockTargetInputScreen
          dependencies={{
            method: currentDestination.method,
            sendUnlockEmailConfirmationUseCase: dependencies.sendUnlockEmailConfirmationUseCase,
            sendUnlockPhoneConfirmationUseCase: dependencies.sendUnlockPhoneConfirmationUseCase,
            onNavigateToOtp: (target, initialDelaySeconds) =>
              push({
                type: 'otp',
                method: currentDestination.method,
                target,
                initialDelaySeconds
              }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'otp':
      return (
        <UnlockOtpScreen
          dependencies={{
            method: currentDestination.method,
            target: currentDestination.target,
            initialDelaySeconds: currentDestination.initialDelaySeconds,
            sendUnlockEmailConfirmationUseCase: dependencies.sendUnlockEmailConfirmationUseCase,
            sendUnlockPhoneConfirmationUseCase: dependencies.sendUnlockPhoneConfirmationUseCase,
            unlockByEmailUseCase: dependencies.unlockByEmailUseCase,
            unlockByPhoneUseCase: dependencies.unlockByPhoneUseCase,
            onUnlockSuccess: () => push({ type: 'success' }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case 'success':
      return (
        <UnlockSuccessScreen
          onFinished={dependencies.onUnlockSuccess}
          strings={strings}
        />
      )

    default:
      return null
  }
}

export interface UnlockRootScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: UnlockRootStoreDependencies
  strings?: FeatureUserStrings
}

export const UnlockRootScreen = forwardRef<HTMLDivElement, UnlockRootScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <UnlockRootProvider dependencies={dependencies}>
          <UnlockRootContent dependencies={dependencies} strings={strings} />
        </UnlockRootProvider>
      </div>
    )
  }
)

UnlockRootScreen.displayName = 'UnlockRootScreen'

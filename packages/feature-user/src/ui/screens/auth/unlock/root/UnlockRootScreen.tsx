import React, { forwardRef } from 'react'
import { UnlockMethod, UserModuleStrings, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { cn } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { UnlockMethodSelectionScreen } from '@/ui/screens/auth/unlock/selection/UnlockMethodSelectionScreen'
import { UnlockTargetInputScreen } from '@/ui/screens/auth/unlock/target/UnlockTargetInputScreen'
import { UnlockOtpScreen } from '@/ui/screens/auth/unlock/otp/UnlockOtpScreen'
import { UnlockSuccessScreen } from '@/ui/screens/auth/unlock/success/UnlockSuccessScreen'
import {
  UnlockDestinationType,
  UnlockRootProvider,
  useUnlockRootStore
} from '@/ui/screens/auth/unlock/root/unlock-root-store'
import type { UnlockRootStoreDependencies } from '@/ui/screens/auth/unlock/root/unlock-root-store'

const UnlockRootContent: React.FC<{
  dependencies: UnlockRootStoreDependencies
  strings?: UserModuleStrings
}> = ({ dependencies, strings = userStrings }) => {
  const stack = useUnlockRootStore((s) => s.stack)
  const push = useUnlockRootStore((s) => s.push)
  const pop = useUnlockRootStore((s) => s.pop)

  const currentDestination = stack[stack.length - 1]

  if (!currentDestination) {
    return null
  }

  switch (currentDestination.type) {
    case UnlockDestinationType.SELECTION:
      return (
        <UnlockMethodSelectionScreen
          dependencies={{
            lockoutType: dependencies.lockoutType ?? null,
            lockoutUntil: dependencies.lockoutUntil ?? null,
            getUserIdentifiersUseCase: dependencies.getUserIdentifiersUseCase,
            unlockByGoogleUseCase: dependencies.unlockByGoogleUseCase,
            onNavigateToEmailInput: () => push({ type: UnlockDestinationType.TARGET_INPUT, method: UnlockMethod.EMAIL }),
            onNavigateToPhoneInput: () => push({ type: UnlockDestinationType.TARGET_INPUT, method: UnlockMethod.PHONE }),
            onUnlockSuccess: () => push({ type: UnlockDestinationType.SUCCESS }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case UnlockDestinationType.TARGET_INPUT:
      return (
        <UnlockTargetInputScreen
          dependencies={{
            method: currentDestination.method,
            sendUnlockEmailConfirmationUseCase: dependencies.sendUnlockEmailConfirmationUseCase,
            sendUnlockPhoneConfirmationUseCase: dependencies.sendUnlockPhoneConfirmationUseCase,
            onNavigateToOtp: (target, initialDelaySeconds) =>
              push({
                type: UnlockDestinationType.OTP,
                method: currentDestination.method,
                target,
                initialDelaySeconds
              }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case UnlockDestinationType.OTP:
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
            onUnlockSuccess: () => push({ type: UnlockDestinationType.SUCCESS }),
            onBack: pop
          }}
          strings={strings}
        />
      )

    case UnlockDestinationType.SUCCESS:
      return (
        <UnlockSuccessScreen
          onFinished={dependencies.onUnlockSuccess}
          strings={strings}
        />
      )
  }
}

/** Props for {@link UnlockRootScreen}. */
export interface UnlockRootScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected store dependencies. */
  dependencies: UnlockRootStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/**
 * Navigation container screen managing multi-step account unlock flows (method selection, target entry, OTP verification, success).
 */
export const UnlockRootScreen = forwardRef<HTMLDivElement, UnlockRootScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
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

import React, { forwardRef } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreCodeTextField,
  CoreEmailTextField,
  CoreErrorText,
  CoreOutlinedTextField,
  CorePasswordTextField,
  CoreScreenTitleText,
  CoreTextButton,
  FullscreenLoading,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import type { UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'
import { AuthProviderButton } from '@/ui/components/auth/button/AuthProviderButton'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/auth-provider-button-mode'
import { AuthProviderGrid } from '@/ui/components/auth/grid/AuthProviderGrid'
import {
  SelfIdentifierListProvider,
  useSelfIdentifierListStore
} from '@/ui/screens/profile/identifier/list/self-identifier-list-store'
import type { AddIdentifierDialogState, SelfIdentifierListStoreDependencies } from "@/ui/screens/profile/identifier/list/self-identifier-list-store";

/**
 * Automation test tags for {@link SelfIdentifierListScreen}.
 */
export const IdentifierListTestTags = {
  TITLE: 'IdentifierList_Title',
  BACK_BUTTON: 'IdentifierList_BackButton',
  REFRESH_BUTTON: 'IdentifierList_RefreshButton',
  GLOBAL_ERROR_TEXT: 'IdentifierList_GlobalErrorText',
  IDENTIFIER_LIST: 'IdentifierList_List',
  ADD_IDENTIFIER_BUTTON: 'IdentifierList_AddIdentifierButton',
  ADD_IDENTIFIER_DIALOG_TITLE: 'IdentifierList_AddIdentifierDialogTitle',
  ACTION_ERROR_TEXT: 'IdentifierList_ActionErrorText'
}

const AddIdentifierDialogContent: React.FC<{
  dialogState: AddIdentifierDialogState
  availableAuthProviders: any
  strings: FeatureUserStrings
}> = ({ dialogState, availableAuthProviders, strings }) => {
  const onAddIdentifierSelectProvider = useSelfIdentifierListStore((s) => s.onAddIdentifierSelectProvider)
  const onAddIdentifierEmailChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierEmailChanged)
  const onAddIdentifierPasswordChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierPasswordChanged)
  const onAddIdentifierTogglePasswordVisibility = useSelfIdentifierListStore((s) => s.onAddIdentifierTogglePasswordVisibility)
  const onAddIdentifierPhoneChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierPhoneChanged)
  const onAddIdentifierCodeChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierCodeChanged)
  const onAddIdentifierSendCode = useSelfIdentifierListStore((s) => s.onAddIdentifierSendCode)
  const onAddIdentifierSubmit = useSelfIdentifierListStore((s) => s.onAddIdentifierSubmit)
  const onAddIdentifierDialogBack = useSelfIdentifierListStore((s) => s.onAddIdentifierDialogBack)
  const errorParser = useAppErrorParser()

  if (dialogState.type === 'providerSelection') {
    return (
      <div className="w-full flex flex-col gap-3 py-2">
        {availableAuthProviders?.primary.map((provider: UserAuthProvider) => (
          <AuthProviderButton
            key={provider}
            authProvider={provider}
            onClick={() => onAddIdentifierSelectProvider(provider)}
            mode={AuthProviderButtonMode.ADD}
            strings={strings}
          />
        ))}

        {availableAuthProviders?.secondary && availableAuthProviders.secondary.length > 0 && (
          <AuthProviderGrid
            authProviders={availableAuthProviders.secondary}
            onProviderClick={onAddIdentifierSelectProvider}
          />
        )}
      </div>
    )
  }

  if (dialogState.type === 'emailFlow') {
    if (!dialogState.isConfirmationSent) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (dialogState.canSendCode) {
              onAddIdentifierSendCode()
            }
          }}
          className="w-full flex flex-col gap-4 py-2"
        >
          <CoreEmailTextField
            value={dialogState.email}
            onChange={(e) => onAddIdentifierEmailChanged(e.target.value)}
            label={strings.email}
            placeholder={strings.email}
            disabled={dialogState.actionLoading}
          />

          {dialogState.actionError && (
            <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
          )}

          <CoreButton
            type="submit"
            label={strings.send_code}
            disabled={!dialogState.canSendCode}
          />
        </form>
      )
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (dialogState.canSubmit) {
            onAddIdentifierSubmit()
          }
        }}
        className="w-full flex flex-col gap-4 py-2"
      >
        <p className="text-xs text-muted-foreground text-center">
          {strings.code_sent_to(dialogState.email)}
        </p>

        <CoreCodeTextField
          value={dialogState.code}
          onChange={(e) => onAddIdentifierCodeChanged(e.target.value)}
          maxLength={6}
          placeholder="000000"
          disabled={dialogState.actionLoading}
        />

        <CorePasswordTextField
          value={dialogState.password}
          onChange={(e) => onAddIdentifierPasswordChanged(e.target.value)}
          isPasswordVisible={dialogState.isPasswordVisible}
          onTogglePasswordVisibility={onAddIdentifierTogglePasswordVisibility}
          label={strings.password}
          placeholder={strings.password}
          disabled={dialogState.actionLoading}
        />

        <div className="flex justify-between items-center text-xs">
          {dialogState.resendTimerSeconds > 0 ? (
            <span className="text-muted-foreground">
              {strings.resend_code_timer(dialogState.resendTimerSeconds)}
            </span>
          ) : (
            <CoreTextButton
              type="button"
              label={strings.resend_code}
              onClick={onAddIdentifierSendCode}
              disabled={!dialogState.canResendCode}
            />
          )}

          <CoreTextButton
            type="button"
            label={strings.change_email}
            onClick={onAddIdentifierDialogBack}
            disabled={dialogState.actionLoading}
          />
        </div>

        {dialogState.actionError && (
          <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
        )}

        <CoreButton
          type="submit"
          label={strings.add_identifier}
          disabled={!dialogState.canSubmit}
        />
      </form>
    )
  }

  if (dialogState.type === 'phoneFlow') {
    if (!dialogState.isConfirmationSent) {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            if (dialogState.canSendCode) {
              onAddIdentifierSendCode()
            }
          }}
          className="w-full flex flex-col gap-4 py-2"
        >
          <CoreOutlinedTextField
            value={dialogState.phoneNumber}
            onChange={(e) => onAddIdentifierPhoneChanged(e.target.value)}
            label={strings.phone_number}
            placeholder={strings.enter_phone_number}
            disabled={dialogState.actionLoading}
          />

          {dialogState.actionError && (
            <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
          )}

          <CoreButton
            type="submit"
            label={strings.send_code}
            disabled={!dialogState.canSendCode}
          />
        </form>
      )
    }

    return (
      <form
        onSubmit={(e) => {
          e.preventDefault()
          if (dialogState.canSubmit) {
            onAddIdentifierSubmit()
          }
        }}
        className="w-full flex flex-col gap-4 py-2"
      >
        <p className="text-xs text-muted-foreground text-center">
          {strings.code_sent_to(dialogState.phoneNumber)}
        </p>

        <CoreCodeTextField
          value={dialogState.code}
          onChange={(e) => onAddIdentifierCodeChanged(e.target.value)}
          maxLength={6}
          placeholder="000000"
          disabled={dialogState.actionLoading}
        />

        <div className="flex justify-between items-center text-xs">
          {dialogState.resendTimerSeconds > 0 ? (
            <span className="text-muted-foreground">
              {strings.resend_code_timer(dialogState.resendTimerSeconds)}
            </span>
          ) : (
            <CoreTextButton
              type="button"
              label={strings.resend_code}
              onClick={onAddIdentifierSendCode}
              disabled={!dialogState.canResendCode}
            />
          )}

          <CoreTextButton
            type="button"
            label={strings.change_phone_number}
            onClick={onAddIdentifierDialogBack}
            disabled={dialogState.actionLoading}
          />
        </div>

        {dialogState.actionError && (
          <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
        )}

        <CoreButton
          type="submit"
          label={strings.add_identifier}
          disabled={!dialogState.canSubmit}
        />
      </form>
    )
  }

  return null
}

const SelfIdentifierListContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useSelfIdentifierListStore((s) => s.screenState)
  const onRefresh = useSelfIdentifierListStore((s) => s.onRefresh)
  const onIdentifierClick = useSelfIdentifierListStore((s) => s.onIdentifierClick)
  const onAddIdentifierClick = useSelfIdentifierListStore((s) => s.onAddIdentifierClick)
  const onAddIdentifierDialogDismiss = useSelfIdentifierListStore((s) => s.onAddIdentifierDialogDismiss)
  const onLoadNextPage = useSelfIdentifierListStore((s) => s.onLoadNextPage)
  const onBackClick = useSelfIdentifierListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-4">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={IdentifierListTestTags.GLOBAL_ERROR_TEXT}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Retry'}
          onClick={onRefresh}
        />
      </div>
    )
  }

  const {
    items,
    currentIdentifierId,
    availableAuthProviders,
    isAddIdentifierSupported,
    addIdentifierDialogState,
    hasMorePages,
    isNextPageLoading,
    actionLoading,
    actionError
  } = screenState

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore: hasMorePages,
    isLoading: isNextPageLoading
  })

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          data-testid={IdentifierListTestTags.BACK_BUTTON}
        />
        <CoreScreenTitleText
          text={strings.identifiers}
          className="absolute left-1/2 -translate-x-1/2"
          data-testid={IdentifierListTestTags.TITLE}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Refresh'}
          onClick={onRefresh}
          disabled={actionLoading}
          data-testid={IdentifierListTestTags.REFRESH_BUTTON}
        />
      </div>

      <div
        className="w-full flex-1 overflow-y-auto flex flex-col gap-3 my-auto max-w-md mx-auto pr-1"
        data-testid={IdentifierListTestTags.IDENTIFIER_LIST}
      >
        {items.map((identifier) => (
          <IdentifierItem
            key={identifier.id}
            identifier={identifier}
            isCurrentIdentifier={currentIdentifierId === identifier.id}
            onClick={() => onIdentifierClick(identifier.id)}
          />
        ))}

        {hasMorePages && <div ref={sentinelRef} className="h-4 w-full" />}

        {isNextPageLoading && (
          <div className="w-full py-2 text-center text-xs text-muted-foreground">
            Loading...
          </div>
        )}
      </div>

      <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-2">
        {isAddIdentifierSupported && (
          <CoreButton
            type="button"
            label={strings.add_identifier}
            onClick={onAddIdentifierClick}
            disabled={actionLoading}
            data-testid={IdentifierListTestTags.ADD_IDENTIFIER_BUTTON}
          />
        )}

        {actionError && (
          <CoreErrorText
            text={errorParser.parse(actionError) ?? ''}
            data-testid={IdentifierListTestTags.ACTION_ERROR_TEXT}
          />
        )}
      </div>

      {addIdentifierDialogState && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-identifier-dialog-title"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onAddIdentifierDialogDismiss}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3
                id="add-identifier-dialog-title"
                className="text-lg font-bold text-surface-foreground"
                data-testid={IdentifierListTestTags.ADD_IDENTIFIER_DIALOG_TITLE}
              >
                {strings.add_identifier}
              </h3>
              <CoreTextButton
                type="button"
                label={strings.cancel}
                onClick={onAddIdentifierDialogDismiss}
              />
            </div>

            <AddIdentifierDialogContent
              dialogState={addIdentifierDialogState}
              availableAuthProviders={availableAuthProviders}
              strings={strings}
            />
          </div>
        </div>
      )}
    </div>
  )
}

/**
 * Props for {@link SelfIdentifierListScreen}.
 */
export interface SelfIdentifierListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: SelfIdentifierListStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component displaying linked user identifiers (email/phone/Google) with options to add new identifiers.
 */
export const SelfIdentifierListScreen = forwardRef<HTMLDivElement, SelfIdentifierListScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SelfIdentifierListProvider dependencies={dependencies}>
          <SelfIdentifierListContent strings={strings} />
        </SelfIdentifierListProvider>
      </div>
    )
  }
)

SelfIdentifierListScreen.displayName = 'SelfIdentifierListScreen'

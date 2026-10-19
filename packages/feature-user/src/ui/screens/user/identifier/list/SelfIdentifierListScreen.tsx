import React, { forwardRef, useEffect, useId } from 'react'
import { UserModuleStrings, userStrings, commonStrings, type AvailableAuthProviders, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
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
  FullscreenError,
  FullscreenLoading,
  hasMorePages,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'
import { AuthProviderButton } from '@/ui/components/auth/button/AuthProviderButton'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/auth-provider-button-mode'
import { AuthProviderGrid } from '@/ui/components/auth/grid/AuthProviderGrid'
import {
  AddIdentifierDialogType,
  SelfIdentifierListProvider,
  SelfIdentifierListStatus,
  useSelfIdentifierListStore
} from '@/ui/screens/user/identifier/list/self-identifier-list-store'
import type { AddIdentifierDialogState, SelfIdentifierListStoreDependencies } from '@/ui/screens/user/identifier/list/self-identifier-list-store'

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
  availableAuthProviders: AvailableAuthProviders | null
  strings: UserModuleStrings
}> = ({ dialogState, availableAuthProviders, strings }) => {
  const onAddIdentifierSelectProvider = useSelfIdentifierListStore((s) => s.onAddIdentifierSelectProvider)
  const onAddIdentifierEmailChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierEmailChanged)
  const onAddIdentifierSubmit = useSelfIdentifierListStore((s) => s.onAddIdentifierSubmit)
  const onAddIdentifierPasswordChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierPasswordChanged)
  const onAddIdentifierTogglePasswordVisibility = useSelfIdentifierListStore((s) => s.onAddIdentifierTogglePasswordVisibility)
  const onAddIdentifierPhoneChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierPhoneChanged)
  const onAddIdentifierCodeChanged = useSelfIdentifierListStore((s) => s.onAddIdentifierCodeChanged)
  const onAddIdentifierSendCode = useSelfIdentifierListStore((s) => s.onAddIdentifierSendCode)
  const onAddIdentifierDialogBack = useSelfIdentifierListStore((s) => s.onAddIdentifierDialogBack)
  const errorParser = useAppErrorParser()

  const emailId = useId()
  const passwordId = useId()
  const phoneId = useId()
  const codeId = useId()

  switch (dialogState.type) {
    case AddIdentifierDialogType.PROVIDER_SELECTION:
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
              strings={strings}
            />
          )}
        </div>
      )

    case AddIdentifierDialogType.EMAIL_FLOW:
      if (!dialogState.isConfirmationSent) {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (dialogState.canSendCode) {
                void onAddIdentifierSendCode()
              }
            }}
            className="w-full flex flex-col gap-4 py-2"
          >
            <CoreEmailTextField
              id={emailId}
              value={dialogState.email}
              onChange={(e) => onAddIdentifierEmailChanged(e.target.value)}
              label={strings.ui.email}
              placeholder={strings.ui.email}
              disabled={dialogState.actionLoading}
            />

            {dialogState.actionError && (
              <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
            )}

            <CoreButton
              type="submit"
              label={strings.ui.sendCode}
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
              void onAddIdentifierSubmit()
            }
          }}
          className="w-full flex flex-col gap-4 py-2"
        >
          <p className="text-xs text-muted-foreground text-center">
            {strings.ui.codeSentTo(dialogState.email)}
          </p>

          <CoreCodeTextField
            id={codeId}
            value={dialogState.code}
            onChange={(e) => onAddIdentifierCodeChanged(e.target.value)}
            maxLength={6}
            placeholder={strings.ui.enterConfirmationCode}
            disabled={dialogState.actionLoading}
          />

          <CorePasswordTextField
            id={passwordId}
            value={dialogState.password}
            onChange={(e) => onAddIdentifierPasswordChanged(e.target.value)}
            isPasswordVisible={dialogState.isPasswordVisible}
            onTogglePasswordVisibility={onAddIdentifierTogglePasswordVisibility}
            label={strings.ui.password}
            placeholder={strings.ui.password}
            disabled={dialogState.actionLoading}
          />

          <div className="flex justify-between items-center text-xs">
            {dialogState.resendTimerSeconds > 0 ? (
              <span className="text-muted-foreground">
                {strings.ui.resendCodeTimer(dialogState.resendTimerSeconds)}
              </span>
            ) : (
              <CoreTextButton
                type="button"
                label={strings.ui.resendCode}
                onClick={onAddIdentifierSendCode}
                disabled={!dialogState.canResendCode}
              />
            )}

            <CoreTextButton
              type="button"
              label={strings.ui.changeEmail}
              onClick={onAddIdentifierDialogBack}
              disabled={dialogState.actionLoading}
            />
          </div>

          {dialogState.actionError && (
            <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
          )}

          <CoreButton
            type="submit"
            label={strings.ui.addIdentifier}
            disabled={!dialogState.canSubmit}
          />
        </form>
      )

    case AddIdentifierDialogType.PHONE_FLOW:
      if (!dialogState.isConfirmationSent) {
        return (
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (dialogState.canSendCode) {
                void onAddIdentifierSendCode()
              }
            }}
            className="w-full flex flex-col gap-4 py-2"
          >
            <CoreOutlinedTextField
              id={phoneId}
              value={dialogState.phoneNumber}
              onChange={(e) => onAddIdentifierPhoneChanged(e.target.value)}
              label={strings.ui.phoneNumber}
              placeholder={strings.ui.enterPhoneNumber}
              disabled={dialogState.actionLoading}
            />

            {dialogState.actionError && (
              <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
            )}

            <CoreButton
              type="submit"
              label={strings.ui.sendCode}
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
              void onAddIdentifierSubmit()
            }
          }}
          className="w-full flex flex-col gap-4 py-2"
        >
          <p className="text-xs text-muted-foreground text-center">
            {strings.ui.codeSentTo(dialogState.phoneNumber)}
          </p>

          <CoreCodeTextField
            id={codeId}
            value={dialogState.code}
            onChange={(e) => onAddIdentifierCodeChanged(e.target.value)}
            maxLength={6}
            placeholder={strings.ui.enterConfirmationCode}
            disabled={dialogState.actionLoading}
          />

          <div className="flex justify-between items-center text-xs">
            {dialogState.resendTimerSeconds > 0 ? (
              <span className="text-muted-foreground">
                {strings.ui.resendCodeTimer(dialogState.resendTimerSeconds)}
              </span>
            ) : (
              <CoreTextButton
                type="button"
                label={strings.ui.resendCode}
                onClick={onAddIdentifierSendCode}
                disabled={!dialogState.canResendCode}
              />
            )}

            <CoreTextButton
              type="button"
              label={strings.ui.changePhoneNumber}
              onClick={onAddIdentifierDialogBack}
              disabled={dialogState.actionLoading}
            />
          </div>

          {dialogState.actionError && (
            <CoreErrorText text={errorParser.parse(dialogState.actionError) ?? ''} />
          )}

          <CoreButton
            type="submit"
            label={strings.ui.addIdentifier}
            disabled={!dialogState.canSubmit}
          />
        </form>
      )
  }
}

const SelfIdentifierListContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = userStrings
}) => {
  const screenState = useSelfIdentifierListStore((s) => s.screenState)
  const onRefresh = useSelfIdentifierListStore((s) => s.onRefresh)
  const onIdentifierClick = useSelfIdentifierListStore((s) => s.onIdentifierClick)
  const onAddIdentifierClick = useSelfIdentifierListStore((s) => s.onAddIdentifierClick)
  const onAddIdentifierDialogDismiss = useSelfIdentifierListStore((s) => s.onAddIdentifierDialogDismiss)
  const onLoadNextPage = useSelfIdentifierListStore((s) => s.onLoadNextPage)
  const onBackClick = useSelfIdentifierListStore((s) => s.onBackClick)
  const errorParser = useAppErrorParser()

  const isContent = screenState.status === SelfIdentifierListStatus.CONTENT
  const hasMore = isContent ? hasMorePages(screenState.paging) : false
  const isNextPageLoading = isContent ? Boolean(screenState.paging.isNextPageLoading) : false

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore,
    isLoading: isNextPageLoading
  })

  switch (screenState.status) {
    case SelfIdentifierListStatus.LOADING:
      return <FullscreenLoading />

    case SelfIdentifierListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={IdentifierListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={onRefresh}
          onBack={onBackClick}
          title={strings.ui.identifiers}
        />
      )

    case SelfIdentifierListStatus.CONTENT: {
      const {
        items,
        currentIdentifierId,
        availableAuthProviders,
        isAddIdentifierSupported,
        addIdentifierDialogState,
        actionLoading,
        actionError
      } = screenState

      return (
        <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-hidden">
          <div className="w-full flex items-center justify-between relative mb-4">
            <CoreBackButton
              onClick={onBackClick}
              data-testid={IdentifierListTestTags.BACK_BUTTON}
            />
            <CoreScreenTitleText
              text={strings.ui.identifiers}
              className="absolute left-1/2 -translate-x-1/2"
              data-testid={IdentifierListTestTags.TITLE}
            />
            <CoreTextButton
              type="button"
              label={commonStrings.ui.refresh}
              onClick={onRefresh}
              disabled={actionLoading}
              data-testid={IdentifierListTestTags.REFRESH_BUTTON}
            />
          </div>

          <div
            className="w-full flex-1 overflow-y-auto flex flex-col gap-3 my-auto max-w-md mx-auto pr-1"
            data-testid={IdentifierListTestTags.IDENTIFIER_LIST}
          >
            {items.map((identifier) => {
              const identifierId = identifier.id
              if (!identifierId) {
                return null
              }
              return (
                <IdentifierItem
                  key={identifierId}
                  identifier={identifier}
                  isCurrentIdentifier={currentIdentifierId === identifierId}
                  onClick={() => onIdentifierClick(identifierId)}
                />
              )
            })}

            {hasMore && <div ref={sentinelRef} className="h-4 w-full" />}

            {isNextPageLoading && (
              <div className="w-full py-2 text-center text-xs text-muted-foreground">
                {commonStrings.ui.loading}
              </div>
            )}
          </div>

          <div className="w-full max-w-md mx-auto pt-4 flex flex-col gap-2">
            {isAddIdentifierSupported && (
              <CoreButton
                type="button"
                label={strings.ui.addIdentifier}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <button
                type="button"
                aria-label={strings.ui.cancel}
                onClick={onAddIdentifierDialogDismiss}
                className="absolute inset-0 bg-background/80 backdrop-blur-sm cursor-default border-none outline-none"
              />
              <div
                className="relative z-10 bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
              >
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h3
                    id="add-identifier-dialog-title"
                    className="text-lg font-bold text-surface-foreground"
                    data-testid={IdentifierListTestTags.ADD_IDENTIFIER_DIALOG_TITLE}
                  >
                    {strings.ui.addIdentifier}
                  </h3>
                  <CoreTextButton
                    type="button"
                    label={strings.ui.cancel}
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
  }
}

const SelfIdentifierListController: React.FC<{ strings?: UserModuleStrings }> = ({
  strings
}) => {
  const loadIdentifiers = useSelfIdentifierListStore((s) => s.loadIdentifiers)

  useEffect(() => {
    loadIdentifiers()
  }, [loadIdentifiers])

  return <SelfIdentifierListContent strings={strings} />
}

/**
 * Props for {@link SelfIdentifierListScreen}.
 */
export interface SelfIdentifierListScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: SelfIdentifierListStoreDependencies
  strings?: UserModuleStrings
}

/**
 * Screen component displaying linked user identifiers (email/phone/Google) with options to add new identifiers.
 */
export const SelfIdentifierListScreen = forwardRef<HTMLDivElement, SelfIdentifierListScreenProps>(
  ({ dependencies, strings = userStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <SelfIdentifierListProvider dependencies={dependencies}>
          <SelfIdentifierListController strings={strings} />
        </SelfIdentifierListProvider>
      </div>
    )
  }
)

SelfIdentifierListScreen.displayName = 'SelfIdentifierListScreen'

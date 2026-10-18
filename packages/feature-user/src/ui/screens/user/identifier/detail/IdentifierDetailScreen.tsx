import React, { forwardRef, useEffect, useId, useState } from 'react'
import { UserModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CorePasswordTextField,
  CoreScreenTitleText,
  CoreTextButton,
  formatEpochMillisToDateTime,
  FullscreenError,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import {
  IdentifierDetailProvider,
  useIdentifierDetailStore
} from '@/ui/screens/user/identifier/detail/identifier-detail-store'
import type { IdentifierDetailStoreDependencies } from '@/ui/screens/user/identifier/detail/identifier-detail-store'

const defaultUserStrings = new UserModuleStrings()
const defaultCommonStrings = new CommonModuleStrings()

/** Automation test tags for {@link IdentifierDetailScreen}. */
export const IdentifierDetailTestTags = {
  TITLE: 'identifier_detail_title',
  BACK_BUTTON: 'identifier_detail_back_button',
  GLOBAL_ERROR: 'identifier_detail_global_error',
  CARD: 'identifier_detail_card',
  USER_ROW: 'identifier_detail_user_row',
  DELETE_BUTTON: 'identifier_detail_delete_button',
  CHANGE_PASSWORD_BUTTON: 'identifier_detail_change_password_button',
  DELETE_PASSWORD_BUTTON: 'identifier_detail_delete_password_button'
}

const DetailRow: React.FC<{
  label: string
  value: string
  onClick?: () => void
  testTag?: string
}> = ({ label, value, onClick, testTag }) => {
  const isClickable = Boolean(onClick)

  return (
    <div
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          onClick()
        }
      }}
      className={cn(
        'w-full flex items-center justify-between py-2 border-b border-border/50 text-xs',
        isClickable ? 'cursor-pointer hover:bg-accent/40 rounded px-2 transition-colors focus:outline-none focus:ring-2 focus:ring-primary' : ''
      )}
      data-testid={testTag}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-surface-foreground">{value}</span>
    </div>
  )
}

const IdentifierDetailContent: React.FC<{ strings?: UserModuleStrings }> = ({
  strings = defaultUserStrings
}) => {
  const screenState = useIdentifierDetailStore((s) => s.screenState)
  const initializeIdentifier = useIdentifierDetailStore((s) => s.initializeIdentifier)
  const onDeleteIdentifierRequested = useIdentifierDetailStore((s) => s.onDeleteIdentifierRequested)
  const onDismissDeleteIdentifierDialog = useIdentifierDetailStore((s) => s.onDismissDeleteIdentifierDialog)
  const onDeleteIdentifierClick = useIdentifierDetailStore((s) => s.onDeleteIdentifierClick)
  const onChangePasswordClick = useIdentifierDetailStore((s) => s.onChangePasswordClick)
  const onConfirmChangePasswordClick = useIdentifierDetailStore((s) => s.onConfirmChangePasswordClick)
  const onDismissChangePasswordDialog = useIdentifierDetailStore((s) => s.onDismissChangePasswordDialog)
  const onDeletePasswordClick = useIdentifierDetailStore((s) => s.onDeletePasswordClick)
  const onRetry = useIdentifierDetailStore((s) => s.onRetry)
  const onBackClick = useIdentifierDetailStore((s) => s.onBackClick)
  const onUserClick = useIdentifierDetailStore((s) => s.onUserClick)
  const errorParser = useAppErrorParser()

  const oldPasswordId = useId()
  const newPasswordId = useId()

  useEffect(() => {
    initializeIdentifier()
  }, [initializeIdentifier])

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <FullscreenError
        data-testid={IdentifierDetailTestTags.GLOBAL_ERROR}
        error={screenState.error}
        onRetry={onRetry}
        onBack={onBackClick}
        title={strings.ui.identifierDetailTitle}
      />
    )
  }

  const {
    identifier,
    isCurrentIdentifier,
    canChangePassword,
    canDeletePassword,
    actionLoading,
    actionError,
    isChangePasswordDialogVisible,
    isDeleteConfirmationVisible
  } = screenState

  const notAvailableText = defaultCommonStrings.ui.notAvailable
  const titleText = isCurrentIdentifier
    ? strings.ui.identifierDetailTitleCurrent
    : strings.ui.identifierDetailTitle

  const createdAtFormatted = formatEpochMillisToDateTime(identifier.createdAt) ?? String(identifier.createdAt)
  const updatedAtFormatted = identifier.updatedAt
    ? formatEpochMillisToDateTime(identifier.updatedAt) ?? String(identifier.updatedAt)
    : notAvailableText

  const handleConfirmChangePassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (oldPassword && newPassword) {
      onConfirmChangePasswordClick(oldPassword, newPassword)
    }
  }

  return (
    <div className="w-full h-full p-6 flex flex-col justify-between relative overflow-y-auto">
      <div className="w-full flex items-center justify-between relative mb-4">
        <CoreBackButton
          onClick={onBackClick}
          data-testid={IdentifierDetailTestTags.BACK_BUTTON}
        />
        <CoreScreenTitleText
          text={titleText}
          className="absolute left-1/2 -translate-x-1/2"
          data-testid={IdentifierDetailTestTags.TITLE}
        />
        <div className="w-10" />
      </div>

      <div
        className="w-full flex-1 flex flex-col gap-4 my-auto max-w-md mx-auto"
        data-testid={IdentifierDetailTestTags.CARD}
      >
        <div className="p-4 bg-card text-card-foreground border border-border rounded-xl shadow-sm flex flex-col gap-2">
          <h3 className="text-base font-bold text-surface-foreground mb-2">
            {identifier.displayName}
          </h3>

          <DetailRow
            label={strings.ui.userLabel}
            value={identifier.userId}
            onClick={onUserClick}
            testTag={IdentifierDetailTestTags.USER_ROW}
          />

          <DetailRow
            label={strings.ui.identifierDetailValue}
            value={identifier.identifier}
          />

          <DetailRow
            label={strings.ui.identifierDetailId}
            value={identifier.id ?? ''}
          />

          <DetailRow
            label={strings.ui.identifierDetailAuthProvider}
            value={identifier.userAuthProvider}
          />

          <DetailRow
            label={strings.ui.identifierDetailExternalEmail}
            value={identifier.externalProviderEmail ?? notAvailableText}
          />

          <DetailRow
            label={strings.ui.identifierDetailCreatedAt}
            value={createdAtFormatted}
          />

          <DetailRow
            label={strings.ui.identifierDetailUpdatedAt}
            value={updatedAtFormatted}
          />
        </div>

        <div className="w-full flex flex-col gap-2 pt-2">
          {canChangePassword && (
            <CoreButton
              type="button"
              label={strings.ui.changePassword}
              onClick={onChangePasswordClick}
              disabled={actionLoading || isCurrentIdentifier}
              data-testid={IdentifierDetailTestTags.CHANGE_PASSWORD_BUTTON}
            />
          )}

          {canDeletePassword && (
            <CoreButton
              type="button"
              label={strings.ui.identifierDeletePasswordButton}
              onClick={onDeletePasswordClick}
              disabled={actionLoading || isCurrentIdentifier}
              className="bg-error hover:bg-error/90 text-error-foreground"
              data-testid={IdentifierDetailTestTags.DELETE_PASSWORD_BUTTON}
            />
          )}

          {!isCurrentIdentifier && (
            <CoreButton
              type="button"
              label={strings.ui.identifierDeleteButton}
              onClick={onDeleteIdentifierRequested}
              disabled={actionLoading}
              className="bg-error hover:bg-error/90 text-error-foreground"
              data-testid={IdentifierDetailTestTags.DELETE_BUTTON}
            />
          )}

          {actionError && !isChangePasswordDialogVisible && (
            <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
          )}
        </div>
      </div>

      {isChangePasswordDialogVisible && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="change-password-dialog-title"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismissChangePasswordDialog}
        >
          <form
            onSubmit={handleConfirmChangePassword}
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <h3 id="change-password-dialog-title" className="text-lg font-bold text-surface-foreground">
              {strings.ui.changePassword}
            </h3>

            <CorePasswordTextField
              id={oldPasswordId}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              isPasswordVisible={isOldPasswordVisible}
              onTogglePasswordVisibility={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
              label={strings.ui.oldPassword}
              placeholder={strings.ui.oldPassword}
              disabled={actionLoading}
            />

            <CorePasswordTextField
              id={newPasswordId}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isPasswordVisible={isNewPasswordVisible}
              onTogglePasswordVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              label={strings.ui.newPassword}
              placeholder={strings.ui.newPassword}
              disabled={actionLoading}
            />

            {actionError && (
              <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.ui.dialogCancel}
                onClick={onDismissChangePasswordDialog}
                disabled={actionLoading}
              />
              <CoreTextButton
                type="submit"
                label={strings.ui.dialogConfirm}
                disabled={actionLoading || !oldPassword.trim() || !newPassword.trim()}
              />
            </div>
          </form>
        </div>
      )}

      {isDeleteConfirmationVisible && (
        <div
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="delete-identifier-dialog-title"
          className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onDismissDeleteIdentifierDialog}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-surface border border-border p-6 rounded-xl shadow-lg max-w-md w-full flex flex-col gap-4"
          >
            <h3 id="delete-identifier-dialog-title" className="text-lg font-bold text-surface-foreground">
              {strings.ui.dialogConfirmTitle}
            </h3>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.ui.dialogCancel}
                onClick={onDismissDeleteIdentifierDialog}
                disabled={actionLoading}
              />
              <CoreTextButton
                type="button"
                label={strings.ui.dialogConfirm}
                onClick={onDeleteIdentifierClick}
                disabled={actionLoading}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

/** Props for {@link IdentifierDetailScreen}. */
export interface IdentifierDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Injected dependencies. */
  dependencies: IdentifierDetailStoreDependencies
  /** Optional localized strings override. */
  strings?: UserModuleStrings
}

/** Screen component displaying detailed information for a single user identifier (email/phone/OAuth). */
export const IdentifierDetailScreen = forwardRef<HTMLDivElement, IdentifierDetailScreenProps>(
  ({ dependencies, strings = defaultUserStrings, className, ...rest }, ref) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <IdentifierDetailProvider dependencies={dependencies}>
          <IdentifierDetailContent strings={strings} />
        </IdentifierDetailProvider>
      </div>
    )
  }
)

IdentifierDetailScreen.displayName = 'IdentifierDetailScreen'

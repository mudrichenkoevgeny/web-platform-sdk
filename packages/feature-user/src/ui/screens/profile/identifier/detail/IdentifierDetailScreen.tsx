import React, { forwardRef, useState } from 'react'
import {
  cn,
  CoreBackButton,
  CoreButton,
  CoreErrorText,
  CorePasswordTextField,
  CoreScreenTitleText,
  CoreTextButton,
  formatEpochMillisToDateTime,
  FullscreenLoading,
  useAppErrorParser
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enUserStrings } from '@/locales/index'
import type { FeatureUserStrings } from "@/locales/index";
import {
  IdentifierDetailProvider,
  useIdentifierDetailStore
} from '@/ui/screens/profile/identifier/detail/IdentifierDetailStore'
import type { IdentifierDetailStoreDependencies } from "@/ui/screens/profile/identifier/detail/IdentifierDetailStore";

/**
 * Automation test tags for {@link IdentifierDetailScreen}.
 */
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
        isClickable ? 'cursor-pointer hover:bg-accent/40 rounded px-2 transition-colors' : ''
      )}
      data-testid={testTag}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
      <span className="font-semibold text-surface-foreground">{value}</span>
    </div>
  )
}

const IdentifierDetailContent: React.FC<{ strings?: FeatureUserStrings }> = ({
  strings = enUserStrings
}) => {
  const screenState = useIdentifierDetailStore((s) => s.screenState)
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

  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isOldPasswordVisible, setIsOldPasswordVisible] = useState(false)
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false)

  if (screenState.status === 'loading') {
    return <FullscreenLoading />
  }

  if (screenState.status === 'error') {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 gap-4">
        <CoreErrorText
          text={errorParser.parse(screenState.error) ?? ''}
          data-testid={IdentifierDetailTestTags.GLOBAL_ERROR}
        />
        <CoreTextButton
          type="button"
          label={strings.resend_code ? strings.resend_code : 'Retry'}
          onClick={onRetry}
        />
      </div>
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

  const notAvailableText = strings.not_available
  const titleText = isCurrentIdentifier
    ? strings.identifier_detail_title_current
    : strings.identifier_detail_title

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
            label={strings.user_label}
            value={strings.user_id(identifier.userId)}
            onClick={onUserClick}
            testTag={IdentifierDetailTestTags.USER_ROW}
          />

          <DetailRow
            label={strings.identifier_detail_value}
            value={identifier.identifier}
          />

          <DetailRow
            label={strings.identifier_detail_id}
            value={identifier.id}
          />

          <DetailRow
            label={strings.identifier_detail_auth_provider}
            value={identifier.userAuthProvider}
          />

          <DetailRow
            label={strings.identifier_detail_external_email}
            value={identifier.externalProviderEmail ?? notAvailableText}
          />

          <DetailRow
            label={strings.identifier_detail_created_at}
            value={createdAtFormatted}
          />

          <DetailRow
            label={strings.identifier_detail_updated_at}
            value={updatedAtFormatted}
          />
        </div>

        <div className="w-full flex flex-col gap-2 pt-2">
          {canChangePassword && (
            <CoreButton
              type="button"
              label={strings.change_password}
              onClick={onChangePasswordClick}
              disabled={actionLoading}
              data-testid={IdentifierDetailTestTags.CHANGE_PASSWORD_BUTTON}
            />
          )}

          {canDeletePassword && (
            <CoreButton
              type="button"
              label={strings.identifier_delete_password_button}
              onClick={onDeletePasswordClick}
              disabled={actionLoading}
              className="bg-error hover:bg-error/90 text-error-foreground"
              data-testid={IdentifierDetailTestTags.DELETE_PASSWORD_BUTTON}
            />
          )}

          {!isCurrentIdentifier && (
            <CoreButton
              type="button"
              label={strings.identifier_delete_button}
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
              {strings.change_password}
            </h3>

            <CorePasswordTextField
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              isPasswordVisible={isOldPasswordVisible}
              onTogglePasswordVisibility={() => setIsOldPasswordVisible(!isOldPasswordVisible)}
              label={strings.old_password}
              placeholder={strings.old_password}
              disabled={actionLoading}
            />

            <CorePasswordTextField
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              isPasswordVisible={isNewPasswordVisible}
              onTogglePasswordVisibility={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
              label={strings.new_password}
              placeholder={strings.new_password}
              disabled={actionLoading}
            />

            {actionError && (
              <CoreErrorText text={errorParser.parse(actionError) ?? ''} />
            )}

            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.dialog_cancel}
                onClick={onDismissChangePasswordDialog}
                disabled={actionLoading}
              />
              <CoreTextButton
                type="submit"
                label={strings.dialog_confirm}
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
              {strings.dialog_confirm_title}
            </h3>
            <div className="flex justify-end gap-2 pt-2">
              <CoreTextButton
                type="button"
                label={strings.dialog_cancel}
                onClick={onDismissDeleteIdentifierDialog}
                disabled={actionLoading}
              />
              <CoreTextButton
                type="button"
                label={strings.dialog_confirm}
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

/**
 * Props for {@link IdentifierDetailScreen}.
 */
export interface IdentifierDetailScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  dependencies: IdentifierDetailStoreDependencies
  strings?: FeatureUserStrings
}

/**
 * Screen component displaying detailed information for a single user identifier (email/phone/OAuth).
 */
export const IdentifierDetailScreen = forwardRef<HTMLDivElement, IdentifierDetailScreenProps>(
  ({ dependencies, strings = enUserStrings, className, ...rest }, ref) => {
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

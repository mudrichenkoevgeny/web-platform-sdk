import React, { forwardRef, useEffect, useId } from 'react'
import type { UserModuleStrings, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import { userStrings, commonStrings, UserAuthProvider } from '@mudrichenkoevgeny/shared-foundation'
import type { AvailableAuthProviders } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingFilterState, ListingSortState } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
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
  ListingHeaderBar,
  ListingOptionsPanel,
  hasMorePages,
  useAppErrorParser,
  useInfiniteScroll
} from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { IdentifierItem } from '@/ui/components/identifier/item/IdentifierItem'
import { AuthProviderButton } from '@/ui/components/auth/button/AuthProviderButton'
import { AuthProviderButtonMode } from '@/ui/components/auth/button/auth-provider-button-mode'
import { AuthProviderGrid } from '@/ui/components/auth/grid/AuthProviderGrid'
import { getIdentifierListOptionsConfig } from './identifier-list-options-config'
import {
  searchParamsToListingStates,
  listingStatesToSearchParams
} from './identifier-list-search-converters'
import {
  AddIdentifierDialogType,
  IdentifierListProvider,
  IdentifierListStatus,
  useIdentifierListStore
} from './identifier-list-store'
import type {
  AddIdentifierDialogState,
  IdentifierListStoreDependencies,
  IdentifierListScreenState
} from './identifier-list-store'

/** Automation test tags for {@link IdentifierListScreen}. */
export const IdentifierListTestTags = {
  TITLE: 'IdentifierList_Title',
  BACK_BUTTON: 'IdentifierList_BackButton',
  REFRESH_BUTTON: 'IdentifierList_RefreshButton',
  FILTER_BUTTON: 'IdentifierList_FilterButton',
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
  const onAddIdentifierSelectProvider = useIdentifierListStore((s) => s.onAddIdentifierSelectProvider)
  const onAddIdentifierEmailChanged = useIdentifierListStore((s) => s.onAddIdentifierEmailChanged)
  const onAddIdentifierSubmit = useIdentifierListStore((s) => s.onAddIdentifierSubmit)
  const onAddIdentifierPasswordChanged = useIdentifierListStore((s) => s.onAddIdentifierPasswordChanged)
  const onAddIdentifierTogglePasswordVisibility = useIdentifierListStore((s) => s.onAddIdentifierTogglePasswordVisibility)
  const onAddIdentifierPhoneChanged = useIdentifierListStore((s) => s.onAddIdentifierPhoneChanged)
  const onAddIdentifierCodeChanged = useIdentifierListStore((s) => s.onAddIdentifierCodeChanged)
  const onAddIdentifierSendCode = useIdentifierListStore((s) => s.onAddIdentifierSendCode)
  const onAddIdentifierDialogBack = useIdentifierListStore((s) => s.onAddIdentifierDialogBack)
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

interface IdentifierListContentProps {
  strings?: UserModuleStrings
  commonModuleStrings?: CommonModuleStrings
  includeFilters?: boolean
  includeOwnerFilter?: boolean
  searchParams?: Record<string, unknown>
}

const IdentifierListContent: React.FC<IdentifierListContentProps> = ({
  strings = userStrings,
  commonModuleStrings = commonStrings,
  includeFilters = false,
  includeOwnerFilter = false,
  searchParams
}) => {
  const screenState = useIdentifierListStore((s) => s.screenState)
  const deps = useIdentifierListStore((s) => s.dependencies)
  const loadIdentifiers = useIdentifierListStore((s) => s.loadIdentifiers)
  const onSearchParamsUpdated = useIdentifierListStore((s) => s.onSearchParamsUpdated)
  const onRefresh = useIdentifierListStore((s) => s.onRefresh)
  const onIdentifierClick = useIdentifierListStore((s) => s.onIdentifierClick)
  const onAddIdentifierClick = useIdentifierListStore((s) => s.onAddIdentifierClick)
  const onAddIdentifierDialogDismiss = useIdentifierListStore((s) => s.onAddIdentifierDialogDismiss)
  const onLoadNextPage = useIdentifierListStore((s) => s.onLoadNextPage)
  const onBackClick = useIdentifierListStore((s) => s.onBackClick)
  const onToggleFilterPanel = useIdentifierListStore((s) => s.onToggleFilterPanel)
  const errorParser = useAppErrorParser()

  const { sortState: activeSortState, filterStates: activeFilterStates } =
    searchParamsToListingStates(searchParams)

  useEffect(() => {
    void loadIdentifiers(searchParams)
  }, [loadIdentifiers, searchParams])

  const showFilters = includeFilters || includeOwnerFilter
  const optionsConfig = getIdentifierListOptionsConfig(commonModuleStrings, includeOwnerFilter)

  const handleSortChange = (newSort: ListingSortState | null) => {
    const listingSearchParameters = listingStatesToSearchParams(newSort, activeFilterStates)
    deps.onSearchParamsChanged?.(listingSearchParameters)
    void onSearchParamsUpdated(listingSearchParameters)
  }

  const handleFilterChange = (newFilters: Record<string, ListingFilterState>) => {
    const listingSearchParameters = listingStatesToSearchParams(activeSortState, newFilters)
    deps.onSearchParamsChanged?.(listingSearchParameters)
    void onSearchParamsUpdated(listingSearchParameters)
  }

  const isContent = screenState.status === IdentifierListStatus.CONTENT
  const hasMore = isContent ? hasMorePages(screenState.paging) : false
  const isNextPageLoading = isContent ? Boolean(screenState.paging.isNextPageLoading) : false

  const sentinelRef = useInfiniteScroll<HTMLDivElement>({
    onLoadMore: onLoadNextPage,
    hasMore,
    isLoading: isNextPageLoading
  })

  switch (screenState.status) {
    case IdentifierListStatus.LOADING:
      return <FullscreenLoading />

    case IdentifierListStatus.ERROR:
      return (
        <FullscreenError
          data-testid={IdentifierListTestTags.GLOBAL_ERROR_TEXT}
          error={screenState.error}
          onRetry={() => void onRefresh(searchParams)}
          onBack={onBackClick}
          title={strings.ui.identifiers}
        />
      )

    case IdentifierListStatus.CONTENT: {
      const {
        items,
        currentIdentifierId,
        availableAuthProviders,
        isAddIdentifierSupported,
        addIdentifierDialogState,
        isFilterPanelExpanded,
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
            <div className="w-10" />
          </div>

          <div className="w-full p-4 border-b border-border bg-surface">
            <ListingHeaderBar
              hasActiveFilters={Object.keys(activeFilterStates).length > 0}
              onOptionsClick={showFilters ? onToggleFilterPanel : undefined}
              onRefreshClick={() => void onRefresh(searchParams)}
            />

            {showFilters && isFilterPanelExpanded && (
              <div className="mt-4 pt-4 border-t border-border">
                <ListingOptionsPanel
                  config={optionsConfig}
                  filterStates={activeFilterStates}
                  sortState={activeSortState}
                  onFilterChanged={(filterId, newState) => {
                    const nextFilters = { ...activeFilterStates }
                    if (newState === null) {
                      delete nextFilters[filterId]
                    } else {
                      nextFilters[filterId] = newState
                    }
                    handleFilterChange(nextFilters)
                  }}
                  onSortChanged={handleSortChange}
                  onApplyClick={() => void onRefresh(searchParams)}
                />
              </div>
            )}
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
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onAddIdentifierDialogDismiss()
                }
              }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 outline-none"
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

export interface IdentifierListProps extends React.HTMLAttributes<HTMLDivElement> {
  searchParams?: Record<string, unknown>
  dependencies: IdentifierListStoreDependencies
  initialState?: IdentifierListScreenState
  strings?: UserModuleStrings
  commonModuleStrings?: CommonModuleStrings
  includeFilters?: boolean
  includeOwnerFilter?: boolean
}

export const IdentifierListScreen = forwardRef<HTMLDivElement, IdentifierListProps>(
  (
    {
      dependencies,
      initialState,
      strings = userStrings,
      commonModuleStrings = commonStrings,
      includeFilters,
      includeOwnerFilter,
      searchParams,
      className,
      ...rest
    },
    ref
  ) => {
    return (
      <div ref={ref} className={cn('w-full h-full relative', className)} {...rest}>
        <IdentifierListProvider dependencies={dependencies} initialState={initialState}>
          <IdentifierListContent
            commonModuleStrings={commonModuleStrings}
            includeFilters={includeFilters}
            includeOwnerFilter={includeOwnerFilter}
            searchParams={searchParams}
            strings={strings}
          />
        </IdentifierListProvider>
      </div>
    )
  }
)

IdentifierListScreen.displayName = 'IdentifierListScreen'

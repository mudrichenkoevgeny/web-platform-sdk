import {
  AuditActorType,
  AuditEventFilterValues,
  AuditEventSortBy,
  AuditStatus,
  UserRole,
  CommonModuleStrings,
  UserModuleStrings,
  commonStrings as globalCommonStrings,
  userStrings as globalUserStrings
} from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/**
 * Constructs the listing options configuration for audit event lists.
 *
 * @param commonStrings - Optional localized common module strings dictionary override.
 * @param userStrings - Optional localized user module strings dictionary override.
 * @returns Configured {@link ListingOptionsConfig} instance for sorting and filtering audit events.
 */
export const getAuditEventListingOptionsConfig = (
  commonStrings: CommonModuleStrings = globalCommonStrings,
  userStrings: UserModuleStrings = globalUserStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: AuditEventSortBy.CREATED_AT,
      title: commonStrings.ui.createdAt
    }
  ],
  filters: [
    {
      type: 'text',
      id: AuditEventFilterValues.EVENT_ID,
      title: userStrings.ui.auditEventId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.ACTOR_ID,
      title: commonStrings.ui.actorId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: AuditEventFilterValues.ACTOR_TYPE,
      title: commonStrings.ui.actorType,
      options: [
        { id: AuditActorType.USER, title: commonStrings.ui.user },
        { id: AuditActorType.SYSTEM, title: commonStrings.ui.system },
        { id: AuditActorType.SERVICE, title: commonStrings.ui.service }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: AuditEventFilterValues.EXCLUDE_ACTOR_TYPE,
      title: `${commonStrings.ui.actorType} (${commonStrings.ui.exclude})`,
      options: [
        { id: AuditActorType.USER, title: commonStrings.ui.user },
        { id: AuditActorType.SYSTEM, title: commonStrings.ui.system },
        { id: AuditActorType.SERVICE, title: commonStrings.ui.service }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: AuditEventFilterValues.ACTOR_USER_ROLE,
      title: commonStrings.ui.role,
      options: [
        { id: UserRole.STAFF, title: commonStrings.ui.staff },
        { id: UserRole.ADMIN, title: commonStrings.ui.admin }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: AuditEventFilterValues.ACTION,
      title: commonStrings.ui.action,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.EXCLUDE_ACTION,
      title: `${commonStrings.ui.action} (${commonStrings.ui.exclude})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.RESOURCE,
      title: commonStrings.ui.resource,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.RESOURCE_ID,
      title: commonStrings.ui.resourceId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: AuditEventFilterValues.STATUS,
      title: commonStrings.ui.status,
      options: [
        { id: AuditStatus.SUCCESS, title: commonStrings.ui.success },
        { id: AuditStatus.FAILED, title: commonStrings.ui.failed },
        { id: AuditStatus.DENIED, title: commonStrings.ui.denied }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: AuditEventFilterValues.EXCLUDE_STATUS,
      title: `${commonStrings.ui.status} (${commonStrings.ui.exclude})`,
      options: [
        { id: AuditStatus.SUCCESS, title: commonStrings.ui.success },
        { id: AuditStatus.FAILED, title: commonStrings.ui.failed },
        { id: AuditStatus.DENIED, title: commonStrings.ui.denied }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: AuditEventFilterValues.CREATED_AT_FROM,
      title: `${commonStrings.ui.createdAt} (${commonStrings.ui.from})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.CREATED_AT_TO,
      title: `${commonStrings.ui.createdAt} (${commonStrings.ui.to})`,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditEventFilterValues.SEARCH_QUERY,
      title: commonStrings.ui.searchPlaceholder,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]
})

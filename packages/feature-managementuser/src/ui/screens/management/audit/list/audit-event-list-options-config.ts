import { AuditActorType, AuditFilterValues, AuditStatus, UserRole, CommonModuleStrings } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

const defaultCommonStrings = new CommonModuleStrings()

export const getAuditEventListingOptionsConfig = (
  commonStrings: CommonModuleStrings = defaultCommonStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: 'CREATED_AT',
      title: commonStrings.ui.createdAt
    }
  ],
  filters: [
    {
      type: 'text',
      id: AuditFilterValues.AuditEventFilterValues.ACTOR_ID,
      title: commonStrings.ui.actorId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: AuditFilterValues.AuditEventFilterValues.ACTOR_TYPE,
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
      id: AuditFilterValues.AuditEventFilterValues.ACTOR_USER_ROLE,
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
      id: AuditFilterValues.AuditEventFilterValues.ACTION,
      title: commonStrings.ui.action,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditFilterValues.AuditEventFilterValues.RESOURCE,
      title: commonStrings.ui.resource,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'text',
      id: AuditFilterValues.AuditEventFilterValues.RESOURCE_ID,
      title: commonStrings.ui.resourceId,
      placeholder: commonStrings.ui.searchPlaceholder
    },
    {
      type: 'choice',
      id: AuditFilterValues.AuditEventFilterValues.STATUS,
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
      type: 'text',
      id: AuditFilterValues.AuditEventFilterValues.MESSAGE,
      title: commonStrings.ui.message,
      placeholder: commonStrings.ui.searchPlaceholder
    }
  ]
})

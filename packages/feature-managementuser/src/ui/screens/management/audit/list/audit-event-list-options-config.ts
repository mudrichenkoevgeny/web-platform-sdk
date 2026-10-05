import { AuditActorType, AuditStatus, UserRole } from '@mudrichenkoevgeny/shared-foundation'
import type { ListingOptionsConfig } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { ChoiceFilterPresentationStyle } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { enManagementUserStrings } from '@/locales/index'
import type { FeatureManagementUserStrings } from '@/locales/index'

export const getAuditEventListingOptionsConfig = (
  strings: FeatureManagementUserStrings = enManagementUserStrings
): ListingOptionsConfig => ({
  sortOptions: [
    {
      id: 'CREATED_AT',
      title: strings.ui_common_created_at
    }
  ],
  filters: [
    {
      type: 'text',
      id: 'actorId',
      title: strings.ui_common_actor_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'choice',
      id: 'actorType',
      title: strings.ui_common_actor_type,
      options: [
        { id: AuditActorType.USER, title: strings.ui_common_user },
        { id: AuditActorType.SYSTEM, title: strings.ui_common_system },
        { id: AuditActorType.SERVICE, title: strings.ui_common_service }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'choice',
      id: 'actorUserRole',
      title: strings.ui_common_role,
      options: [
        { id: UserRole.STAFF, title: strings.ui_common_staff },
        { id: UserRole.ADMIN, title: strings.ui_common_admin }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: 'action',
      title: strings.ui_common_action,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'resource',
      title: strings.ui_common_resource,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'text',
      id: 'resourceId',
      title: strings.ui_common_resource_id,
      placeholder: strings.ui_common_search_placeholder
    },
    {
      type: 'choice',
      id: 'status',
      title: strings.ui_common_status,
      options: [
        { id: AuditStatus.SUCCESS, title: strings.ui_common_success },
        { id: AuditStatus.FAILED, title: strings.ui_common_failed },
        { id: AuditStatus.DENIED, title: strings.ui_common_denied }
      ],
      isMultiple: true,
      presentationStyle: ChoiceFilterPresentationStyle.DROPDOWN
    },
    {
      type: 'text',
      id: 'message',
      title: strings.ui_common_message,
      placeholder: strings.ui_common_search_placeholder
    }
  ]
})

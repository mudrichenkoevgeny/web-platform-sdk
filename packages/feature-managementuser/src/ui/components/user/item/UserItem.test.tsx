import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentTestHarness } from '@mudrichenkoevgeny/web-platform-sdk-core-common'
import { createTestUserSummaryPayload, toUserSummary, userStrings } from '@mudrichenkoevgeny/shared-foundation'
import { UserItem } from '@/ui/components/user/item/UserItem'

describe('UserItem', () => {
  it('renders user details and handles click', async () => {
    const onClick = vi.fn()
    const user = userEvent.setup()
    const userDetails = toUserSummary(createTestUserSummaryPayload())

    render(
      <ComponentTestHarness>
        <UserItem user={userDetails} onClick={onClick} />
      </ComponentTestHarness>
    )

    expect(screen.getByText(String(userDetails.id))).toBeDefined()
    expect(screen.getByText(`${userStrings.ui.userRole}: ${userDetails.role}`)).toBeDefined()
    expect(screen.getByText(`${userStrings.ui.userAccountStatus}: ${userDetails.accountStatus}`)).toBeDefined()

    const item = screen.getByTestId(`UserItem_${String(userDetails.id)}`)
    await user.click(item)

    expect(onClick).toHaveBeenCalledTimes(1)
  })
})

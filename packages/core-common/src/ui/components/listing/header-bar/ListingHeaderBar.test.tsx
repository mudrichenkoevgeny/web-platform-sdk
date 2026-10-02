import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListingHeaderBar } from './ListingHeaderBar'
import { ComponentTestHarness } from '../../../../testing/ComponentTestHarness'

describe('ListingHeaderBar', () => {
  it('triggers onRefreshClick when refresh button clicked', async () => {
    const onRefresh = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <ListingHeaderBar onRefreshClick={onRefresh} />
      </ComponentTestHarness>
    )

    const refreshBtn = screen.getByRole('button')
    await user.click(refreshBtn)

    expect(onRefresh).toHaveBeenCalledTimes(1)
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PagingFooter } from '@/ui/components/listing/paging-footer/PagingFooter'
import { ComponentTestHarness } from '@/testing/ComponentTestHarness'

describe('PagingFooter', () => {
  it('displays page info and handles page changes', async () => {
    const onPageChange = vi.fn()
    const user = userEvent.setup()

    render(
      <ComponentTestHarness>
        <PagingFooter
          currentPage={2}
          totalPages={5}
          totalCount={50}
          onPageChange={onPageChange}
        />
      </ComponentTestHarness>
    )

    expect(screen.getByText('Page 2 of 5')).toBeDefined()
    expect(screen.getByText('Total: 50')).toBeDefined()

    const nextPageButton = screen.getByLabelText('Next page')
    await user.click(nextPageButton)

    expect(onPageChange).toHaveBeenCalledWith(3)
  })
})

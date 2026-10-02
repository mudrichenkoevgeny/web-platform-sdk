import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { CoreVerticalScrollbar, CoreLazyColumnScrollbar } from './CoreScrollbar'

describe('CoreScrollbar', () => {
  it('renders null as Web scrollbars are handled natively via CSS container styles', () => {
    const { container } = render(<CoreVerticalScrollbar />)
    expect(container.firstChild).toBeNull()
  })

  it('CoreLazyColumnScrollbar renders null', () => {
    const { container } = render(<CoreLazyColumnScrollbar />)
    expect(container.firstChild).toBeNull()
  })
})

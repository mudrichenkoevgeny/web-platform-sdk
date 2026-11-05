import { describe, it, expect } from 'vitest'
import { createMockCommonComponent } from '@/mock/di/common-component-mock'

describe('common-component-mock', () => {
  it('createMockCommonComponent creates an initialized CommonComponent instance', () => {
    const component = createMockCommonComponent()
    expect(component).toBeDefined()
    expect(component.appErrorParser).toBeDefined()
  })
})

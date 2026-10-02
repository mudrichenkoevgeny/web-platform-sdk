import React from 'react'
import type { Preview } from '@storybook/react'
import { ComponentTestHarness } from '../src/testing/ComponentTestHarness'
import {
  ScreenSizePreviewSpecs,
  DialogSizePreviewSpecs
} from '../src/testing/previewSpecs'

const customViewports = {
  mobile: {
    name: ScreenSizePreviewSpecs.NAME_MOBILE,
    styles: {
      width: `${ScreenSizePreviewSpecs.WIDTH_MOBILE}px`,
      height: `${ScreenSizePreviewSpecs.HEIGHT_MOBILE}px`
    }
  },
  tablet: {
    name: ScreenSizePreviewSpecs.NAME_TABLET,
    styles: {
      width: `${ScreenSizePreviewSpecs.WIDTH_TABLET}px`,
      height: `${ScreenSizePreviewSpecs.HEIGHT_TABLET}px`
    }
  },
  desktop: {
    name: ScreenSizePreviewSpecs.NAME_DESKTOP,
    styles: {
      width: `${ScreenSizePreviewSpecs.WIDTH_DESKTOP}px`,
      height: `${ScreenSizePreviewSpecs.HEIGHT_DESKTOP}px`
    }
  },
  dialogCompact: {
    name: DialogSizePreviewSpecs.NAME_COMPACT,
    styles: {
      width: `${DialogSizePreviewSpecs.WIDTH_COMPACT}px`,
      height: `${DialogSizePreviewSpecs.HEIGHT_COMPACT}px`
    }
  },
  dialogMobileSheet: {
    name: DialogSizePreviewSpecs.NAME_MOBILE_SHEET,
    styles: {
      width: `${DialogSizePreviewSpecs.WIDTH_MOBILE_SHEET}px`,
      height: `${DialogSizePreviewSpecs.HEIGHT_MOBILE_SHEET}px`
    }
  },
  dialogStandard: {
    name: DialogSizePreviewSpecs.NAME_STANDARD,
    styles: {
      width: `${DialogSizePreviewSpecs.WIDTH_STANDARD}px`,
      height: `${DialogSizePreviewSpecs.HEIGHT_STANDARD}px`
    }
  }
}

const preview: Preview = {
  parameters: {
    viewport: {
      viewports: customViewports
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i
      }
    }
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'light',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light' },
          { value: 'dark', title: 'Dark' }
        ],
        dynamicTitle: true
      }
    }
  },
  decorators: [
    (Story, context) => {
      const mode = (context.globals.theme as 'light' | 'dark') ?? 'light'
      return (
        <ComponentTestHarness defaultMode={mode}>
          <Story />
        </ComponentTestHarness>
      )
    }
  ]
}

export default preview

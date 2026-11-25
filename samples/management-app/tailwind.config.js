if (typeof require !== 'undefined' && require.extensions && !require.extensions['.svg']) {
  require.extensions['.svg'] = () => () => null
}

import { sdkTailwindPreset } from '@mudrichenkoevgeny/web-platform-sdk/core/common'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sdkTailwindPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/sdk/dist/**/*.{js,mjs,cjs}'
  ]
}

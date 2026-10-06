import { sdkTailwindPreset } from '@mudrichenkoevgeny/web-platform-sdk-core-common'

/** @type {import('tailwindcss').Config} */
export default {
  presets: [sdkTailwindPreset],
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}'
  ]
}

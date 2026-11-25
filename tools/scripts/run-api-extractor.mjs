import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { Extractor, ExtractorConfig } = require('@microsoft/api-extractor')

const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
const rootDir = path.resolve(currentFileDir, '../..')
const isLocal = process.argv.includes('--local')

const entries = [
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'core-common',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/core/common/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'core-security',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/core/security/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'core-settings',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/core/settings/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'core-storage',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/core/storage/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'feature-user',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/feature/user/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'feature-client-user',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/feature/client-user/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk',
    packageFolder: path.join(rootDir, 'packages/sdk'),
    entryName: 'feature-management-user',
    mainEntryPointFilePath: path.join(rootDir, 'packages/sdk/dist/feature/management-user/index.d.ts')
  },
  {
    packageName: '@mudrichenkoevgeny/web-platform-sdk-tools',
    packageFolder: path.join(rootDir, 'packages/tools'),
    entryName: 'tools',
    mainEntryPointFilePath: path.join(rootDir, 'packages/tools/dist/index.d.ts')
  }
]

let hasError = false

for (const entry of entries) {
  if (!fs.existsSync(entry.mainEntryPointFilePath)) {
    console.error(`[api-extractor] Main entry point file missing: ${entry.mainEntryPointFilePath}`)
    hasError = true
    continue
  }

  const etcFolder = path.join(entry.packageFolder, 'etc')
  fs.mkdirSync(etcFolder, { recursive: true })

  const tempFolder = path.join(entry.packageFolder, 'temp')
  fs.mkdirSync(tempFolder, { recursive: true })

  const configObject = {
    $schema: 'https://developer.microsoft.com/json-schemas/api-extractor/v7/api-extractor.schema.json',
    projectFolder: entry.packageFolder,
    mainEntryPointFilePath: entry.mainEntryPointFilePath,
    compiler: {
      tsconfigFilePath: path.join(entry.packageFolder, 'tsconfig.json')
    },
    apiReport: {
      enabled: true,
      reportFileName: `${entry.entryName}.api.md`,
      reportFolder: etcFolder,
      reportTempFolder: tempFolder
    },
    docModel: {
      enabled: false
    },
    dtsRollup: {
      enabled: false
    },
    tsdocMetadata: {
      enabled: false
    },
    messages: {
      compilerMessageReporting: {
        default: { logLevel: 'warning' }
      },
      extractorMessageReporting: {
        default: { logLevel: 'warning' },
        'ae-missing-release-tag': { logLevel: 'none' },
        'ae-unresolved-link': { logLevel: 'none' },
        'ae-forgotten-export': { logLevel: 'none' },
        'ae-undocumented': { logLevel: 'none' }
      },
      tsdocMessageReporting: {
        default: { logLevel: 'warning' },
        'tsdoc-undefined-tag': { logLevel: 'none' }
      }
    }
  }

  const extractorConfig = ExtractorConfig.prepare({
    configObject,
    configObjectFullPath: path.join(entry.packageFolder, `api-extractor-${entry.entryName}.json`),
    packageJsonFullPath: path.join(entry.packageFolder, 'package.json')
  })

  const extractorResult = Extractor.invoke(extractorConfig, {
    localBuild: isLocal,
    showVerboseMessages: false
  })

  if (!extractorResult.succeeded) {
    console.error(`[api-extractor] API Extractor failed for ${entry.entryName}`)
    hasError = true
  } else {
    console.log(`[api-extractor] Verified API contract for ${entry.entryName}`)
  }
}

if (hasError) {
  process.exit(1)
}

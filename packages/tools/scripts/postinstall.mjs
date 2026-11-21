#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncAgentRules } from '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const scriptPath = __filename.toLowerCase()
const cwd = process.cwd().toLowerCase()
const initCwd = (process.env.INIT_CWD || process.cwd()).toLowerCase()

const isDlxCache =
  scriptPath.includes('dlx') ||
  scriptPath.includes('pnpm-cache') ||
  scriptPath.includes('pnpm\\dlx') ||
  scriptPath.includes('pnpm/dlx') ||
  cwd.includes('dlx') ||
  cwd.includes('pnpm-cache') ||
  initCwd.includes('dlx') ||
  initCwd.includes('pnpm-cache')

if (isDlxCache) {
  process.exit(0)
}

const targetRootDir = process.env.INIT_CWD || process.cwd()
const targetPkgJsonPath = path.join(targetRootDir, 'package.json')

if (!fs.existsSync(targetPkgJsonPath)) {
  process.exit(0)
}

syncAgentRules({
  sourceAgentDir: path.join(__dirname, '../.agent/global/web'),
  relativeTargetSubdir: '.agent/global/web',
  packageName: 'Web Platform SDK Tools'
})

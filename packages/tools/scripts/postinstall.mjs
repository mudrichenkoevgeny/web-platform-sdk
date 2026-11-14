#!/usr/bin/env node
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncAgentRules } from '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

syncAgentRules({
  sourceAgentDir: path.join(__dirname, '../.agent/global'),
  relativeTargetSubdir: '.agent/global',
  packageName: 'Web Platform SDK Tools'
})

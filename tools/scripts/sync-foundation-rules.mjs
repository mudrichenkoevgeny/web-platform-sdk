import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { syncAgentRules } from '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs'

function findWorkspaceRoot(startDir) {
  let currentDir = path.resolve(startDir)
  while (currentDir !== path.parse(currentDir).root) {
    if (fs.existsSync(path.join(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir
    }
    currentDir = path.dirname(currentDir)
  }
  return process.cwd()
}

const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
const rootDir = findWorkspaceRoot(currentFileDir)

let foundationPkgDir
try {
  const resolvedEntry = import.meta.resolve('@mudrichenkoevgeny/shared-foundation')
  foundationPkgDir = path.dirname(fileURLToPath(resolvedEntry))
} catch (_err) {
  foundationPkgDir = path.join(rootDir, 'node_modules/@mudrichenkoevgeny/shared-foundation')
}

let sourceDir = path.join(foundationPkgDir, '.agent/global/common')
if (!fs.existsSync(sourceDir)) {
  sourceDir = path.join(foundationPkgDir, '.agent/common')
}

syncAgentRules({
  sourceAgentDir: sourceDir,
  relativeTargetSubdir: '.agent/global/common',
  packageName: 'Shared Foundation',
  targetRootDir: rootDir
})

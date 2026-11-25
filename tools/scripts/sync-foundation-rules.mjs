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

function patchFoundationExports(nodeModulesDir) {
  if (!fs.existsSync(nodeModulesDir)) return
  fs.readdirSync(nodeModulesDir, { withFileTypes: true }).forEach((entry) => {
    const full = path.join(nodeModulesDir, entry.name)
    if (entry.isDirectory()) {
      if (entry.name !== '.bin') patchFoundationExports(full)
    } else if (entry.name === 'package.json' && full.includes('shared-foundation')) {
      try {
        const pkg = JSON.parse(fs.readFileSync(full, 'utf-8'))
        if (pkg.exports && pkg.exports['./tokens'] && typeof pkg.exports['./tokens'] === 'object') {
          if (!pkg.exports['./tokens'].require || !pkg.exports['./tokens'].default) {
            pkg.exports['./tokens'].require = './dist/design-system/tokens.js'
            pkg.exports['./tokens'].default = './dist/design-system/tokens.js'
            fs.writeFileSync(full, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
          }
        }
      } catch (_e) {
      }
    }
  })
}

const currentFileDir = fileURLToPath(new URL('.', import.meta.url))
const rootDir = findWorkspaceRoot(currentFileDir)

patchFoundationExports(path.join(rootDir, 'node_modules'))

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

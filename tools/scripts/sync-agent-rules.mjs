import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

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

const globalSourceDir = path.join(rootDir, '.agent/global')
const packageTargetDir = path.join(rootDir, 'packages/tools/.agent/global')

if (fs.existsSync(globalSourceDir)) {
  fs.rmSync(packageTargetDir, { recursive: true, force: true })
  fs.mkdirSync(packageTargetDir, { recursive: true })
  fs.cpSync(globalSourceDir, packageTargetDir, { recursive: true, force: true })
  console.log('[sync-agent-rules] Synced .agent/global -> packages/tools/.agent/global')
}

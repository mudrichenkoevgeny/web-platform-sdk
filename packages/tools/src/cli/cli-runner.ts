import fs from 'node:fs'
import path from 'node:path'
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { syncAgentRules } from '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/**
 * Finds the package root directory for @mudrichenkoevgeny/web-platform-sdk-tools.
 *
 * @param startDir - Starting directory for root resolution
 * @returns Resolved package root directory absolute path
 */
function findPackageDir(startDir: string): string {
  let currentDir = path.resolve(startDir)
  while (currentDir !== path.parse(currentDir).root) {
    const packageJsonPath = path.join(currentDir, 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      try {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'))
        if (pkg.name === '@mudrichenkoevgeny/web-platform-sdk-tools') {
          return currentDir
        }
      } catch {
        /* Intentionally ignore JSON parse errors during parent traversal */
      }
    }
    currentDir = path.dirname(currentDir)
  }
  return process.cwd()
}

/**
 * Supported CLI command types.
 */
export type CliCommand = 'sync' | 'sync-agent-rules' | 'generate' | 'check-exports' | 'api-extract' | 'help'

type CommandHandler = (args: string[]) => Promise<void> | void

/**
 * Runs the Web Platform SDK Tools CLI.
 *
 * @param args - CLI arguments array (default: process.argv.slice(2))
 */
export async function runCli(args: string[] = process.argv.slice(2)): Promise<void> {
  const rawCommand = args[0] as CliCommand | undefined
  const commandName: CliCommand = rawCommand && ['sync', 'sync-agent-rules', 'generate', 'check-exports', 'api-extract', 'help'].includes(rawCommand)
    ? rawCommand
    : 'help'

  const packageDir = findPackageDir(__dirname)

  const commandHandlers: Record<CliCommand, CommandHandler> = {
    sync: () => {
      syncAgentRules({
        sourceAgentDir: path.join(packageDir, '.agent/global'),
        relativeTargetSubdir: '.agent/global',
        packageName: 'Web Platform SDK Tools'
      })
    },
    'sync-agent-rules': () => {
      syncAgentRules({
        sourceAgentDir: path.join(packageDir, '.agent/global'),
        relativeTargetSubdir: '.agent/global',
        packageName: 'Web Platform SDK Tools'
      })
    },
    generate: (cmdArgs: string[]) => {
      const plopfilePath = path.join(packageDir, 'generators/plopfile.mjs')
      const extraArgs = cmdArgs.slice(1).join(' ')
      execSync(`pnpm plop --plopfile "${plopfilePath}" ${extraArgs}`, { stdio: 'inherit' })
    },
    'check-exports': () => {
      console.log('[web-sdk-tools] Verifying package exports via publint...')
      execSync('pnpm exec publint', { stdio: 'inherit' })
    },
    'api-extract': () => {
      console.log('[web-sdk-tools] Extracting public API signatures via API Extractor...')
      execSync('pnpm exec api-extractor run --local', { stdio: 'inherit' })
    },
    help: () => {
      console.log(`
Web Platform SDK Tools CLI v0.1.0

Available Commands:
  web-sdk-tools sync            Synchronize global agent rules into project .agent/global/
  web-sdk-tools generate        Scaffold UseCases or React components
  web-sdk-tools check-exports   Verify package.json exports via publint
  web-sdk-tools api-extract     Verify public API signatures via API Extractor
`)
    }
  }

  const handler = commandHandlers[commandName]
  await handler(args)
}

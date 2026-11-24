import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const currentFileDir = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(currentFileDir, '../..')
const packagesDir = path.join(rootDir, 'packages')

const rootPkgPath = path.join(rootDir, 'package.json')
const rootPkg = JSON.parse(fs.readFileSync(rootPkgPath, 'utf-8'))

let expectedVersion = typeof rootPkg.version === 'string' && rootPkg.version.trim() !== ''
  ? rootPkg.version.trim()
  : null

const packageEntries = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(packagesDir, entry.name))

const scannedPackages = []
let hasError = false

for (const pkgDir of packageEntries) {
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    const relPath = path.relative(rootDir, pkgJsonPath)
    const actualVersion = typeof pkg.version === 'string' ? pkg.version.trim() : ''

    scannedPackages.push({
      name: pkg.name || path.basename(pkgDir),
      path: relPath,
      version: actualVersion
    })

    if (expectedVersion === null && actualVersion !== '') {
      expectedVersion = actualVersion
    }
  }
}

if (expectedVersion === null) {
  console.error('[version:verify] Error: Could not determine expected version from root or packages.')
  process.exit(1)
}

for (const pkgInfo of scannedPackages) {
  if (pkgInfo.version === '') {
    console.error(`[version:verify] Error: Missing or empty 'version' field in ${pkgInfo.path} (${pkgInfo.name}). Expected version '${expectedVersion}'.`)
    hasError = true
  } else if (pkgInfo.version !== expectedVersion) {
    console.error(`[version:verify] Error: Version mismatch in ${pkgInfo.path} (${pkgInfo.name}): found '${pkgInfo.version}', expected '${expectedVersion}'.`)
    hasError = true
  }
}

if (hasError) {
  process.exit(1)
}

console.log(`[version:verify] Successfully verified ${scannedPackages.length} packages synchronized at version ${expectedVersion}`)

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.resolve(__dirname, '../..')
const packagesDir = path.join(rootDir, 'packages')

const rawArg = process.argv[2]
if (!rawArg) {
  console.error('Error: Please specify target version or bump type (e.g. node bump-version.mjs 0.1.2 or patch/minor/major)')
  process.exit(1)
}

const cleanedArg = rawArg.trim().replace(/^v/, '')
const isBumpType = ['patch', 'minor', 'major'].includes(cleanedArg)
const semverRegex = /^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/

if (!isBumpType && !semverRegex.test(cleanedArg)) {
  console.error(`Error: Invalid version format or bump type "${rawArg}". Must be 'patch', 'minor', 'major', or a valid SemVer string (e.g. 0.1.2).`)
  process.exit(1)
}

const packageDirs = fs.readdirSync(packagesDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => path.join(packagesDir, entry.name))

for (const pkgDir of packageDirs) {
  const pkgJsonPath = path.join(pkgDir, 'package.json')
  if (fs.existsSync(pkgJsonPath)) {
    const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8'))
    let newVersion = cleanedArg

    if (isBumpType) {
      const [major, minor, patch] = (pkg.version || '0.1.0').split('.').map(Number)
      if (cleanedArg === 'patch') {
        newVersion = `${major}.${minor}.${patch + 1}`
      } else if (cleanedArg === 'minor') {
        newVersion = `${major}.${minor + 1}.0`
      } else if (cleanedArg === 'major') {
        newVersion = `${major + 1}.0.0`
      }
    }

    pkg.version = newVersion
    fs.writeFileSync(pkgJsonPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8')
    console.log(`[bump-version] Updated ${pkg.name} -> ${newVersion}`)
  }
}

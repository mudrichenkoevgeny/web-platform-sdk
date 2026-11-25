function readPackage(pkg) {
  if (pkg.name === '@mudrichenkoevgeny/shared-foundation' && pkg.exports) {
    if (pkg.exports['./tokens']) {
      if (typeof pkg.exports['./tokens'] === 'object') {
        pkg.exports['./tokens'].default = './dist/design-system/tokens.js'
        pkg.exports['./tokens'].require = './dist/design-system/tokens.js'
      }
    }
  }

  if (
    pkg.name === 'typescript-eslint' ||
    (pkg.name && pkg.name.startsWith('@typescript-eslint/'))
  ) {
    if (pkg.peerDependencies && pkg.peerDependencies.typescript) {
      delete pkg.peerDependencies.typescript
    }
    if (pkg.peerDependenciesMeta && pkg.peerDependenciesMeta.typescript) {
      delete pkg.peerDependenciesMeta.typescript
    }
    pkg.dependencies = pkg.dependencies || {}
    pkg.dependencies.typescript = '5.8.3'
  }
  return pkg
}

module.exports = {
  hooks: {
    readPackage
  }
}

function readPackage(pkg) {
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

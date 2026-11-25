/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: 'no-feature-cross-dependencies',
      severity: 'error',
      comment: 'Feature modules must not depend on other feature modules. Use composition in the host app or core modules.',
      from: { path: '^packages/sdk/src/feature/([^/]+)/' },
      to: { path: '^packages/sdk/src/feature/([^/]+)/', pathNot: '^packages/sdk/src/feature/$1/' }
    },
    {
      name: 'core-common-is-sacred',
      severity: 'error',
      comment: 'core-common must not depend on any higher-level layers (features, samples, other cores).',
      from: { path: '^packages/sdk/src/core/common/' },
      to: { path: '^(packages/sdk/src/feature/|packages/sdk/src/core/(?!common/)|samples/)' }
    },
    {
      name: 'ban-axios-and-react-query',
      severity: 'error',
      comment: 'Axios and TanStack Query are strictly forbidden by architectural guidelines.',
      from: {},
      to: { path: 'node_modules/(axios|@tanstack/react-query)' }
    }
  ],
  options: {
    doNotFollow: { path: '(node_modules|dist|build)' },
    exclude: { path: '(dist|build)' },
    tsPreCompilationDeps: true,
    tsConfig: { fileName: 'tsconfig.base.json' }
  }
};

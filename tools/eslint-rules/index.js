/**
 * @fileoverview Custom ESLint architectural rules for Web Platform SDK.
 */

const BRANDED_ID_PATTERN = /^[A-Z][a-zA-Z0-9]*Id$/;

const noDirectBrandedCastRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block direct string-to-branded-type casting (e.g., id as UserId). Require toXxxIdOrThrow() or toXxxIdOrNull().',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    messages: {
      noBrandedCast: "Direct type assertion to branded type '{{typeName}}' (e.g., id as {{typeName}}) is strictly prohibited. Use to{{typeName}}OrThrow() or to{{typeName}}OrNull() instead."
    }
  },
  create(context) {
    function checkBrandedCast(node, typeAnnotation) {
      if (!typeAnnotation || typeAnnotation.type !== 'TSTypeReference') {
        return;
      }

      let typeName = null;
      if (typeAnnotation.typeName.type === 'Identifier') {
        typeName = typeAnnotation.typeName.name;
      } else if (typeAnnotation.typeName.type === 'TSQualifiedName' && typeAnnotation.typeName.right.type === 'Identifier') {
        typeName = typeAnnotation.typeName.right.name;
      }

      if (typeName && BRANDED_ID_PATTERN.test(typeName)) {
        context.report({
          node,
          messageId: 'noBrandedCast',
          data: { typeName }
        });
      }
    }

    return {
      TSAsExpression(node) {
        checkBrandedCast(node, node.typeAnnotation);
      },
      TSTypeAssertion(node) {
        checkBrandedCast(node, node.typeAnnotation);
      }
    };
  }
};

const noThrowInRepoUsecaseRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Ensure Repositories and UseCases never contain throw statements and only return appResultFailure().',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    messages: {
      noThrowInRepoOrUseCase: "Repositories and UseCases must never contain 'throw' statements. Return error results wrapped in appResultFailure() instead."
    }
  },
  create(context) {
    const filename = context.filename || context.getFilename?.() || '';
    const normalizedPath = filename.replace(/\\/g, '/');

    // Skip test, story, and mock files
    const isTestOrMock = /\.(test|spec|stories)\.[jt]sx?$/.test(normalizedPath) || /\/mock\//.test(normalizedPath);

    const isRepoOrUseCaseFile = !isTestOrMock && (
      /\/(repository|repositories|usecase|usecases|use-case|use-cases)\//i.test(normalizedPath) ||
      /(Repository|UseCase)\.[jt]sx?$/i.test(normalizedPath)
    );

    function isInsideRepoOrUseCaseScope(node) {
      let current = node.parent;
      while (current) {
        if (
          (current.type === 'ClassDeclaration' || current.type === 'ClassExpression') &&
          current.id &&
          /(Repository|UseCase)/.test(current.id.name)
        ) {
          return true;
        }
        if (
          (current.type === 'FunctionDeclaration' || current.type === 'FunctionExpression' || current.type === 'ArrowFunctionExpression') &&
          current.id &&
          /(Repository|UseCase)/.test(current.id.name)
        ) {
          return true;
        }
        if (
          current.type === 'VariableDeclarator' &&
          current.id &&
          current.id.type === 'Identifier' &&
          /(Repository|UseCase)/.test(current.id.name)
        ) {
          return true;
        }
        current = current.parent;
      }
      return false;
    }

    return {
      ThrowStatement(node) {
        if (isTestOrMock) {
          return;
        }
        if (isRepoOrUseCaseFile || isInsideRepoOrUseCaseScope(node)) {
          context.report({
            node,
            messageId: 'noThrowInRepoOrUseCase'
          });
        }
      }
    };
  }
};

const noEmptyDiArrayRule = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Block hardcoded empty arrays in DI container initializations.',
      category: 'Possible Errors',
      recommended: true
    },
    schema: [],
    messages: {
      noEmptyDiArray: 'Hardcoding empty arrays in DI container initializations (e.g., new CompositeAuditActionTypeParser([])) is strictly prohibited. Domain parsers must be required properties in the Config interface and injected from the top-level application graph.'
    }
  },
  create(context) {
    const filename = context.filename || context.getFilename?.() || '';
    const normalizedPath = filename.replace(/\\/g, '/');
    const isDiFile = /\/(di|containers?)\//i.test(normalizedPath) || /(Container|Component|Di)\.[jt]sx?$/i.test(normalizedPath);

    function isEmptyArray(node) {
      return node && node.type === 'ArrayExpression' && node.elements.length === 0;
    }

    return {
      NewExpression(node) {
        const calleeName = node.callee.type === 'Identifier' ? node.callee.name : '';
        const isParserClass = /Parser$/.test(calleeName);

        if (isParserClass) {
          const hasEmptyArrayArg = node.arguments.some(isEmptyArray);
          if (hasEmptyArrayArg) {
            context.report({
              node,
              messageId: 'noEmptyDiArray'
            });
            return;
          }
        }

        if (isDiFile) {
          const hasEmptyArrayArg = node.arguments.some(isEmptyArray);
          if (hasEmptyArrayArg) {
            context.report({
              node,
              messageId: 'noEmptyDiArray'
            });
          }
        }
      },
      CallExpression(node) {
        if (isDiFile) {
          const calleeName = node.callee.type === 'Identifier' ? node.callee.name : '';
          if (/create|init|build|setup/i.test(calleeName)) {
            const hasEmptyArrayArg = node.arguments.some(isEmptyArray);
            if (hasEmptyArrayArg) {
              context.report({
                node,
                messageId: 'noEmptyDiArray'
              });
            }
          }
        }
      }
    };
  }
};

const plugin = {
  meta: {
    name: 'eslint-plugin-sdk-arch',
    version: '1.0.0'
  },
  rules: {
    'no-direct-branded-cast': noDirectBrandedCastRule,
    'no-throw-in-repo-usecase': noThrowInRepoUsecaseRule,
    'no-empty-di-array': noEmptyDiArrayRule
  }
};

export default plugin;

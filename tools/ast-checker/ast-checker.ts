import { Project, SyntaxKind, AsExpression, ThrowStatement, NewExpression, SourceFile } from 'ts-morph';

export interface AstViolation {
  filePath: string;
  line: number;
  column: number;
  ruleId: 'no-direct-branded-cast' | 'no-throw-in-repo-usecase' | 'no-empty-di-array';
  message: string;
}

const BRANDED_ID_PATTERN = /^[A-Z][a-zA-Z0-9]*Id$/;

export class AstRuleChecker {
  private project: Project;

  constructor(tsConfigFilePath?: string) {
    this.project = new Project({
      tsConfigFilePath,
      skipAddingFilesFromTsConfig: true
    });
  }

  public addSourceFile(filePath: string, content: string): SourceFile {
    return this.project.createSourceFile(filePath, content, { overwrite: true });
  }

  public checkSourceFile(sourceFile: SourceFile): AstViolation[] {
    const violations: AstViolation[] = [];
    const filePath = sourceFile.getFilePath().replace(/\\/g, '/');
    const isTestOrMock = /\.(test|spec|stories)\.[jt]sx?$/.test(filePath) || /\/mock\//.test(filePath);

    // Rule 1: no-direct-branded-cast
    sourceFile.getDescendantsOfKind(SyntaxKind.AsExpression).forEach((asExpr: AsExpression) => {
      const typeNode = asExpr.getTypeNode();
      if (typeNode && typeNode.getKind() === SyntaxKind.TypeReference) {
        const typeName = typeNode.getText().trim();
        if (BRANDED_ID_PATTERN.test(typeName)) {
          const start = asExpr.getStart();
          const { line, column } = sourceFile.getLineAndColumnAtPos(start);
          violations.push({
            filePath,
            line,
            column,
            ruleId: 'no-direct-branded-cast',
            message: `Direct type assertion to branded type '${typeName}' (e.g., id as ${typeName}) is strictly prohibited. Use to${typeName}OrThrow() or to${typeName}OrNull() instead.`
          });
        }
      }
    });

    // Rule 2: no-throw-in-repo-usecase
    if (!isTestOrMock) {
      const isRepoOrUseCaseFile = (
        /\/(repository|repositories|usecase|usecases|use-case|use-cases)\//i.test(filePath) ||
        /(Repository|UseCase)\.[jt]sx?$/i.test(filePath)
      );

      sourceFile.getDescendantsOfKind(SyntaxKind.ThrowStatement).forEach((throwStmt: ThrowStatement) => {
        let isScopeMatch = isRepoOrUseCaseFile;
        if (!isScopeMatch) {
          let parent = throwStmt.getParent();
          while (parent) {
            const kind = parent.getKind();
            if (
              kind === SyntaxKind.ClassDeclaration ||
              kind === SyntaxKind.FunctionDeclaration ||
              kind === SyntaxKind.MethodDeclaration
            ) {
              const name = (parent as any).getName?.() || '';
              if (/(Repository|UseCase)/.test(name)) {
                isScopeMatch = true;
                break;
              }
            }
            parent = parent.getParent();
          }
        }

        if (isScopeMatch) {
          const start = throwStmt.getStart();
          const { line, column } = sourceFile.getLineAndColumnAtPos(start);
          violations.push({
            filePath,
            line,
            column,
            ruleId: 'no-throw-in-repo-usecase',
            message: `Repositories and UseCases must never contain 'throw' statements. Return error results wrapped in appResultFailure() instead.`
          });
        }
      });
    }

    // Rule 3: no-empty-di-array
    const isDiFile = /\/(di|containers?)\//i.test(filePath) || /(Container|Component|Di)\.[jt]sx?$/i.test(filePath);

    sourceFile.getDescendantsOfKind(SyntaxKind.NewExpression).forEach((newExpr: NewExpression) => {
      const expressionText = newExpr.getExpression().getText();
      const isParserClass = /Parser$/.test(expressionText);
      const args = newExpr.getArguments();

      const hasEmptyArrayArg = args.some(arg => {
        return arg.getKind() === SyntaxKind.ArrayLiteralExpression && (arg as any).getElements().length === 0;
      });

      if ((isParserClass || isDiFile) && hasEmptyArrayArg) {
        const start = newExpr.getStart();
        const { line, column } = sourceFile.getLineAndColumnAtPos(start);
        violations.push({
          filePath,
          line,
          column,
          ruleId: 'no-empty-di-array',
          message: `Hardcoding empty arrays in DI container initializations (e.g., new CompositeAuditActionTypeParser([])) is strictly prohibited. Domain parsers must be required properties in the Config interface and injected from the top-level application graph.`
        });
      }
    });

    return violations;
  }

  public checkProjectFiles(globPattern: string = 'packages/**/*.ts'): AstViolation[] {
    this.project.addSourceFilesAtPaths(globPattern);
    const violations: AstViolation[] = [];
    for (const sourceFile of this.project.getSourceFiles()) {
      violations.push(...this.checkSourceFile(sourceFile));
    }
    return violations;
  }
}

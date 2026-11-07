import { describe, it, expect } from 'vitest';
import { AstRuleChecker } from '../ast-checker/ast-checker';

describe('Custom AST Rule Engine (ts-morph & ESLint rules)', () => {
  const checker = new AstRuleChecker();

  describe('Rule 1: no-direct-branded-cast', () => {
    it('should report violation for direct branded ID casting (as UserId)', () => {
      const sourceFile = checker.addSourceFile(
        'packages/feature-user/src/service/UserService.ts',
        `
        const id = '123' as UserId;
        const sessionId = 'abc' as UserSessionId;
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const brandedCastViolations = violations.filter(v => v.ruleId === 'no-direct-branded-cast');

      expect(brandedCastViolations).toHaveLength(2);
      expect(brandedCastViolations[0].message).toContain("Direct type assertion to branded type 'UserId'");
      expect(brandedCastViolations[1].message).toContain("Direct type assertion to branded type 'UserSessionId'");
    });

    it('should pass for valid conversions using domain helpers and standard type casts', () => {
      const sourceFile = checker.addSourceFile(
        'packages/feature-user/src/service/UserService.ts',
        `
        const userId = toUserIdOrThrow('123');
        const session = toUserSessionIdOrNull('abc');
        const str = val as string;
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const brandedCastViolations = violations.filter(v => v.ruleId === 'no-direct-branded-cast');

      expect(brandedCastViolations).toHaveLength(0);
    });
  });

  describe('Rule 2: no-throw-in-repo-usecase', () => {
    it('should report violation when throw statement is used in repository file', () => {
      const sourceFile = checker.addSourceFile(
        'packages/feature-user/src/repository/UserRepositoryImpl.ts',
        `
        export class UserRepositoryImpl {
          public async getUser() {
            throw new Error('Database disconnected');
          }
        }
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const throwViolations = violations.filter(v => v.ruleId === 'no-throw-in-repo-usecase');

      expect(throwViolations).toHaveLength(1);
      expect(throwViolations[0].message).toContain("Repositories and UseCases must never contain 'throw' statements");
    });

    it('should report violation when throw statement is used in usecase file', () => {
      const sourceFile = checker.addSourceFile(
        'packages/feature-user/src/usecase/AuthenticateUserUseCase.ts',
        `
        export class AuthenticateUserUseCase {
          public async execute() {
            throw new Error('Invalid credentials');
          }
        }
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const throwViolations = violations.filter(v => v.ruleId === 'no-throw-in-repo-usecase');

      expect(throwViolations).toHaveLength(1);
    });

    it('should pass for returning appResultFailure instead of throw in repository', () => {
      const sourceFile = checker.addSourceFile(
        'packages/feature-user/src/repository/UserRepositoryImpl.ts',
        `
        export class UserRepositoryImpl {
          public async getUser() {
            return appResultFailure(createAppError('DbError'));
          }
        }
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const throwViolations = violations.filter(v => v.ruleId === 'no-throw-in-repo-usecase');

      expect(throwViolations).toHaveLength(0);
    });
  });

  describe('Rule 3: no-empty-di-array', () => {
    it('should report violation when instantiating parser with empty array []', () => {
      const sourceFile = checker.addSourceFile(
        'packages/core-common/src/di/container.ts',
        `
        const parser = new CompositeAuditActionTypeParser([]);
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const diViolations = violations.filter(v => v.ruleId === 'no-empty-di-array');

      expect(diViolations).toHaveLength(1);
      expect(diViolations[0].message).toContain('Hardcoding empty arrays in DI container initializations');
    });

    it('should pass when instantiating parser with injected parsers array', () => {
      const sourceFile = checker.addSourceFile(
        'packages/core-common/src/di/container.ts',
        `
        const parser = new CompositeAuditActionTypeParser(injectedParsers);
        `
      );

      const violations = checker.checkSourceFile(sourceFile);
      const diViolations = violations.filter(v => v.ruleId === 'no-empty-di-array');

      expect(diViolations).toHaveLength(0);
    });
  });
});

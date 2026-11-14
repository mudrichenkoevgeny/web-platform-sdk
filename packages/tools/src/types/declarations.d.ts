declare module '@mudrichenkoevgeny/shared-foundation/scripts/agent-rules-syncer.mjs' {
  export interface SyncAgentRulesOptions {
    sourceAgentDir: string
    relativeTargetSubdir: string
    packageName: string
  }
  export function syncAgentRules(options: SyncAgentRulesOptions): void
}

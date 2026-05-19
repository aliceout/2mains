import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Batch 4 du dual-field richText : conversion markdown → Lexical pour
// les globals Identite (mission) et BanderoleUrgence (message).
// Idempotent.

type EditorConfig = Parameters<typeof convertMarkdownToLexical>[0]['editorConfig']

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

async function migrateGlobalField(
  payload: MigrateUpArgs['payload'],
  slug: 'identite' | 'banderole-urgence',
  fromKey: string,
  toKey: string,
  editorConfig: EditorConfig,
): Promise<boolean> {
  const doc = (await payload.findGlobal({ slug, depth: 0 })) as unknown as Record<string, unknown>
  if (hasLexicalContent(doc[toKey])) return false
  const md = typeof doc[fromKey] === 'string' ? (doc[fromKey] as string).trim() : ''
  if (!md) return false
  const lexicalState = convertMarkdownToLexical({ editorConfig, markdown: md })
  await payload.updateGlobal({
    slug,
    data: { [toKey]: lexicalState } as never,
  })
  return true
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const m = await migrateGlobalField(
    payload,
    'identite',
    'mission',
    'mission_rich',
    editorConfig,
  )
  const b = await migrateGlobalField(
    payload,
    'banderole-urgence',
    'message',
    'message_rich',
    editorConfig,
  )

  payload.logger.info(
    { identite_mission: m, banderole_message: b },
    'globals markdown → lexical done',
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "identite" SET "mission_rich" = NULL`)
  await db.execute(sql`UPDATE "banderole_urgence" SET "message_rich" = NULL`)
}

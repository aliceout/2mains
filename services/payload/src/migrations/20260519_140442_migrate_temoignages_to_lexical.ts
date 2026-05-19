import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Conversion markdown → Lexical pour la collection Temoignages
// (champ `citation`). Idempotent.

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const { docs } = await payload.find({
    collection: 'temoignages',
    limit: 1000,
    depth: 0,
  })

  let migrated = 0
  for (const doc of docs) {
    const d = doc as unknown as Record<string, unknown>
    if (hasLexicalContent(d.citation_rich)) continue
    const md = typeof d.citation === 'string' ? d.citation.trim() : ''
    if (!md) continue
    const lexicalState = convertMarkdownToLexical({
      editorConfig,
      markdown: md,
    })
    await payload.update({
      collection: 'temoignages',
      id: doc.id,
      data: { citation_rich: lexicalState } as never,
    })
    migrated++
  }

  payload.logger.info({ migrated }, 'temoignages markdown → lexical done')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "temoignages" SET "citation_rich" = NULL`)
}

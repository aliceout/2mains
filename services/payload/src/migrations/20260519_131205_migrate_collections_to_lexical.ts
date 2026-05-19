import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Batch 3 du dual-field richText : conversion markdown → Lexical pour
// les collections Actualites (description + body) et Evenements (body).
// Idempotent.

type EditorConfig = Parameters<typeof convertMarkdownToLexical>[0]['editorConfig']

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

function convertIfNeeded(
  doc: Record<string, unknown>,
  fromKey: string,
  toKey: string,
  editorConfig: EditorConfig,
): boolean {
  if (hasLexicalContent(doc[toKey])) return false
  const md =
    typeof doc[fromKey] === 'string' ? (doc[fromKey] as string).trim() : ''
  if (!md) return false
  doc[toKey] = convertMarkdownToLexical({ editorConfig, markdown: md })
  return true
}

async function migrateCollection(
  payload: MigrateUpArgs['payload'],
  collection: 'actualites' | 'evenements',
  fields: Array<{ from: string; to: string }>,
  editorConfig: EditorConfig,
): Promise<number> {
  let migrated = 0
  const { docs } = await payload.find({
    collection,
    limit: 1000,
    depth: 0,
  })
  for (const doc of docs) {
    let changed = false
    const data: Record<string, unknown> = {}
    for (const { from, to } of fields) {
      const d = doc as unknown as Record<string, unknown>
      if (convertIfNeeded(d, from, to, editorConfig)) {
        data[to] = d[to]
        changed = true
        migrated++
      }
    }
    if (changed) {
      await payload.update({
        collection,
        id: doc.id,
        data: data as never,
      })
    }
  }
  return migrated
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const a = await migrateCollection(
    payload,
    'actualites',
    [
      { from: 'description', to: 'description_rich' },
      { from: 'body', to: 'body_rich' },
    ],
    editorConfig,
  )
  const e = await migrateCollection(
    payload,
    'evenements',
    [{ from: 'body', to: 'body_rich' }],
    editorConfig,
  )

  payload.logger.info(
    { actualites: a, evenements: e },
    'collections markdown → lexical done',
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "actualites" SET "description_rich" = NULL, "body_rich" = NULL`)
  await db.execute(sql`UPDATE "evenements" SET "body_rich" = NULL`)
}

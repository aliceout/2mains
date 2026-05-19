import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Phase 2 du dual-field Prose (cf. services/payload/src/blocks/Prose.ts) :
// convertit chaque `pages_blocks_prose.body` markdown legacy en JSON
// Lexical dans `body_rich`. Idempotent — skip les blocs déjà migrés
// (body_rich non vide) ou sans body markdown à convertir.
//
// On laisse `body` intact ; la suppression du champ sera traitée par
// une migration ultérieure (Phase 3), une fois la prod vérifiée.
//
// Tourne automatiquement au boot du container Payload via la CMD
// `payload migrate` du Dockerfile.

type ProseBlock = {
  blockType: 'prose'
  body?: string | null
  body_rich?: unknown
  [k: string]: unknown
}

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const sanitized = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const { docs: pages } = await payload.find({
    collection: 'pages',
    limit: 1000,
    depth: 0,
  })

  let migrated = 0
  let skipped = 0

  for (const page of pages) {
    const sections = (page.sections ?? []) as ProseBlock[]
    let changed = false

    for (const section of sections) {
      if (section.blockType !== 'prose') continue

      if (hasLexicalContent(section.body_rich)) {
        skipped++
        continue
      }
      const md = typeof section.body === 'string' ? section.body.trim() : ''
      if (!md) {
        skipped++
        continue
      }

      section.body_rich = convertMarkdownToLexical({
        editorConfig: sanitized,
        markdown: md,
      })
      changed = true
      migrated++
    }

    if (changed) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: { sections } as never,
      })
    }
  }

  payload.logger.info(
    { migrated, skipped },
    'prose markdown → lexical migration done',
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reset body_rich à NULL sur tous les blocs prose. body markdown est
  // intact, donc le frontend retombera automatiquement sur lui via le
  // fallback dans PageRenderer.astro.
  await db.execute(sql`UPDATE "pages_blocks_prose" SET "body_rich" = NULL`)
}

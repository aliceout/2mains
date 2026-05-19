import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Batch 1 du dual-field richText : convertit le markdown legacy en
// JSON Lexical pour les blocs longs (Callout.body, Lettre.corps,
// TextePhoto.texte, DeuxColonnes.texte, Faq.questions[].reponse).
//
// Pattern identique à la migration Prose : on itère sur les pages via
// l'API Payload, on traverse les sections, et pour chaque bloc cible
// on convertit le champ markdown en Lexical s'il n'a pas déjà été
// rempli côté admin. Idempotent.

type SectionBlock = {
  blockType: string
  // Les champs markdown legacy + leurs équivalents rich.
  body?: string | null
  body_rich?: unknown
  corps?: string | null
  corps_rich?: unknown
  texte?: string | null
  texte_rich?: unknown
  questions?: Array<{
    reponse?: string | null
    reponse_rich?: unknown
    [k: string]: unknown
  }>
  [k: string]: unknown
}

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

type EditorConfig = Parameters<typeof convertMarkdownToLexical>[0]['editorConfig']

/** Convertit `<from>` (markdown) → `<to>` (Lexical) sur un bloc si pas déjà fait.
 *  Retourne true si une conversion a eu lieu, false si skip. */
function migrateField(
  block: Record<string, unknown>,
  fromKey: string,
  toKey: string,
  editorConfig: EditorConfig,
): boolean {
  if (hasLexicalContent(block[toKey])) return false
  const md =
    typeof block[fromKey] === 'string' ? (block[fromKey] as string).trim() : ''
  if (!md) return false
  block[toKey] = convertMarkdownToLexical({ editorConfig, markdown: md })
  return true
}

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const { docs: pages } = await payload.find({
    collection: 'pages',
    limit: 1000,
    depth: 0,
  })

  let migrated = 0

  for (const page of pages) {
    const sections = (page.sections ?? []) as SectionBlock[]
    let changed = false

    for (const section of sections) {
      switch (section.blockType) {
        case 'callout':
          if (migrateField(section, 'body', 'body_rich', editorConfig)) {
            changed = true
            migrated++
          }
          break
        case 'lettre':
          if (migrateField(section, 'corps', 'corps_rich', editorConfig)) {
            changed = true
            migrated++
          }
          break
        case 'texte-photo':
        case 'deux-colonnes':
          if (migrateField(section, 'texte', 'texte_rich', editorConfig)) {
            changed = true
            migrated++
          }
          break
        case 'faq': {
          const items = section.questions ?? []
          for (const item of items) {
            if (
              migrateField(
                item as Record<string, unknown>,
                'reponse',
                'reponse_rich',
                editorConfig,
              )
            ) {
              changed = true
              migrated++
            }
          }
          break
        }
        default:
          break
      }
    }

    if (changed) {
      await payload.update({
        collection: 'pages',
        id: page.id,
        data: { sections } as never,
      })
    }
  }

  payload.logger.info({ migrated }, 'long-blocks markdown → lexical done')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reset à NULL — le frontend retombera sur le markdown legacy intact.
  await db.execute(sql`UPDATE "pages_blocks_callout" SET "body_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_lettre" SET "corps_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_texte_photo" SET "texte_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_deux_colonnes" SET "texte_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_faq_questions" SET "reponse_rich" = NULL`)
}

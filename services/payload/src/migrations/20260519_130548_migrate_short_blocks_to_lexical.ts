import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Batch 2 du dual-field richText : conversion markdown → Lexical pour
// tous les blocs courts (Citation/CitationLarge, Cta, ChiffreDetail,
// BlocStat.intro, Equipe.intro, StatMajeste, et les blocs avec arrays :
// Etapes/Formats/Portraits/BlocCartes/BlocValeurs/Timeline).
//
// Pattern identique aux migrations Prose et long blocks : payload.find
// + walk sections + convert + payload.update. Idempotent.

type EditorConfig = Parameters<typeof convertMarkdownToLexical>[0]['editorConfig']

function hasLexicalContent(value: unknown): boolean {
  if (!value || typeof value !== 'object') return false
  const root = (value as { root?: { children?: unknown[] } }).root
  return !!(root && Array.isArray(root.children) && root.children.length > 0)
}

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

function migrateArrayItems(
  arr: unknown,
  fromKey: string,
  toKey: string,
  editorConfig: EditorConfig,
): number {
  if (!Array.isArray(arr)) return 0
  let count = 0
  for (const item of arr) {
    if (
      item &&
      typeof item === 'object' &&
      migrateField(item as Record<string, unknown>, fromKey, toKey, editorConfig)
    ) {
      count++
    }
  }
  return count
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sections = (page.sections ?? []) as any[]
    let changed = false

    for (const section of sections) {
      let n = 0
      switch (section.blockType) {
        case 'citation':
        case 'citation-large':
          n += migrateField(section, 'citation', 'citation_rich', editorConfig) ? 1 : 0
          break
        case 'cta':
          n += migrateField(section, 'corps', 'corps_rich', editorConfig) ? 1 : 0
          break
        case 'chiffre-detail':
        case 'stat-majeste':
          n += migrateField(section, 'texte', 'texte_rich', editorConfig) ? 1 : 0
          break
        case 'stats':
        case 'equipe':
          n += migrateField(section, 'intro', 'intro_rich', editorConfig) ? 1 : 0
          break
        case 'etapes':
          n += migrateArrayItems(section.etapes, 'description', 'description_rich', editorConfig)
          break
        case 'formats':
          n += migrateArrayItems(section.formats, 'description', 'description_rich', editorConfig)
          break
        case 'portraits':
          n += migrateArrayItems(section.personnes, 'bio', 'bio_rich', editorConfig)
          break
        case 'cartes':
          n += migrateArrayItems(section.cartes, 'description', 'description_rich', editorConfig)
          break
        case 'valeurs':
          n += migrateArrayItems(section.valeurs, 'description', 'description_rich', editorConfig)
          break
        case 'timeline':
          n += migrateArrayItems(section.etapes, 'texte', 'texte_rich', editorConfig)
          break
        default:
          break
      }
      if (n > 0) {
        changed = true
        migrated += n
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

  payload.logger.info({ migrated }, 'short-blocks markdown → lexical done')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`UPDATE "pages_blocks_citation" SET "citation_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_citation_large" SET "citation_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_cta" SET "corps_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_chiffre_detail" SET "texte_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_stats" SET "intro_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_equipe" SET "intro_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_stat_majeste" SET "texte_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_etapes_etapes" SET "description_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_formats_formats" SET "description_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_portraits_personnes" SET "bio_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_cartes_cartes" SET "description_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_valeurs_valeurs" SET "description_rich" = NULL`)
  await db.execute(sql`UPDATE "pages_blocks_timeline_etapes" SET "texte_rich" = NULL`)
}

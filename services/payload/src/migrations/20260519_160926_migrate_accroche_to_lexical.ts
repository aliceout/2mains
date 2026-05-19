import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Ajoute la colonne `hero_accroche_rich` (jsonb Lexical) sur la table
// pages et convertit l'accroche markdown legacy de chaque page en
// JSON Lexical. Pattern identique aux migrations de Phase 2.
//
// La colonne legacy `hero_accroche` (varchar) reste pour l'instant
// comme champ "héritage" dans l'admin — sera supprimée par une
// migration ultérieure une fois la prod vérifiée.

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages" ADD COLUMN "hero_accroche_rich" jsonb`)

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
    const hero = (page as unknown as { hero?: Record<string, unknown> }).hero
    if (!hero) continue
    const md = typeof hero.accroche === 'string' ? hero.accroche.trim() : ''
    if (!md) continue
    const lexicalState = convertMarkdownToLexical({
      editorConfig,
      markdown: md,
    })
    await payload.update({
      collection: 'pages',
      id: page.id,
      data: {
        hero: { ...hero, accroche_rich: lexicalState } as never,
      } as never,
    })
    migrated++
  }

  payload.logger.info({ migrated }, 'accroche markdown → lexical done')
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages" DROP COLUMN "hero_accroche_rich"`)
}

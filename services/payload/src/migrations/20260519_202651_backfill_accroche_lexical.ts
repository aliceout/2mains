import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'
import {
  convertMarkdownToLexical,
  defaultEditorConfig,
  sanitizeServerEditorConfig,
} from '@payloadcms/richtext-lexical'

// Rattrapage : la migration 20260519_160926_migrate_accroche_to_lexical
// utilisait `payload.find()` + `payload.update()` AVEC un `db.execute()`
// ALTER TABLE en début de migration. Drizzle wrap les migrations dans
// une transaction qui prend un lock ACCESS EXCLUSIVE sur `pages` après
// l'ALTER COLUMN, et le `payload.find()` ouvre une 2e connexion qui
// fait `SELECT COUNT(*) FROM pages` → bloquée par le lock → self-deadlock.
//
// En prod la migration a été marquée appliquée à la main pour débloquer
// le boot, mais la conversion des données n'a pas eu lieu. Cette
// migration rattrape ça en SQL direct (pas de payload.* qui ouvrirait
// une autre connexion) — idempotente : ne touche que les pages qui ont
// un accroche markdown ET pas encore d'accroche_rich.

function escapeForLog(s: string): string {
  return s.length > 50 ? s.slice(0, 50) + '…' : s
}

export async function up({ db, payload }: MigrateUpArgs): Promise<void> {
  const editorConfig = await sanitizeServerEditorConfig(
    defaultEditorConfig,
    payload.config,
  )

  const result = await db.execute<{
    id: number
    hero_accroche: string
  }>(sql`
    SELECT id, hero_accroche
      FROM "pages"
     WHERE hero_accroche IS NOT NULL
       AND hero_accroche <> ''
       AND hero_accroche_rich IS NULL
  `)

  let migrated = 0
  for (const row of result.rows) {
    const md = (row.hero_accroche ?? '').trim()
    if (!md) continue
    const lexicalState = convertMarkdownToLexical({
      editorConfig,
      markdown: md,
    })
    await db.execute(sql`
      UPDATE "pages"
         SET "hero_accroche_rich" = ${JSON.stringify(lexicalState)}::jsonb
       WHERE id = ${row.id}
    `)
    migrated++
    payload.logger.debug(
      { page_id: row.id, preview: escapeForLog(md) },
      'accroche backfill',
    )
  }

  payload.logger.info(
    { migrated, total_candidates: result.rows.length },
    'accroche backfill done',
  )
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Reset à NULL — le frontend retombera sur l'accroche markdown legacy
  // intact via le fallback Hero.astro.
  await db.execute(sql`UPDATE "pages" SET "hero_accroche_rich" = NULL`)
}

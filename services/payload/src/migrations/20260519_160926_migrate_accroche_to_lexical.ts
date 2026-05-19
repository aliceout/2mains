import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Ajoute la colonne `hero_accroche_rich` (jsonb Lexical) sur la table
// pages. La conversion des données markdown → Lexical est traitée
// par une migration séparée (20260519_202651_backfill_accroche_lexical)
// pour éviter le self-deadlock qui survenait quand cette migration
// combinait ADD COLUMN + payload.find() :
//
//   - Drizzle wrap les migrations dans une transaction qui prend un
//     lock ACCESS EXCLUSIVE sur `pages` au moment de l'ALTER COLUMN.
//   - `payload.find()` ouvre une 2e connexion qui tente un
//     `SELECT count(*) FROM pages` → bloquée par le lock → hang infini.
//
// La séparation schema / data permet d'éviter ce piège.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages" ADD COLUMN "hero_accroche_rich" jsonb`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`ALTER TABLE "pages" DROP COLUMN "hero_accroche_rich"`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Drizzle a généré `ADD COLUMN nom varchar NOT NULL` sans default,
  // ce qui plante en prod sur une table media qui contient déjà des
  // rows (Postgres refuse). On fait en 3 temps : ADD nullable, backfill
  // depuis filename (fallback "Média sans nom" si filename absent), puis
  // SET NOT NULL.
  await db.execute(sql`ALTER TABLE "media" ADD COLUMN "nom" varchar`)
  await db.execute(sql`
    UPDATE "media"
       SET "nom" = COALESCE(NULLIF(filename, ''), 'Média sans nom')
     WHERE "nom" IS NULL
  `)
  await db.execute(sql`ALTER TABLE "media" ALTER COLUMN "nom" SET NOT NULL`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "nom";`)
}

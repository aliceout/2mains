import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_prose" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "pages_blocks_prose" ADD COLUMN "body_rich" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_prose" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "pages_blocks_prose" DROP COLUMN "body_rich";`)
}

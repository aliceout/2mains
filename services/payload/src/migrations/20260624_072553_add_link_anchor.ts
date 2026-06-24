import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_link_anchor" varchar;
  ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_link_anchor" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_link_anchor" varchar;
  ALTER TABLE "pages_blocks_soutenir_home" ADD COLUMN "cta_primaire_link_anchor" varchar;
  ALTER TABLE "pages_blocks_soutenir_home" ADD COLUMN "cta_secondaire_link_anchor" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_link_anchor" varchar;
  ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_link_anchor" varchar;
  ALTER TABLE "navigation_header_nav_children" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "navigation_header_nav" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "navigation_header_buttons" ADD COLUMN "link_anchor" varchar;
  ALTER TABLE "navigation_footer_columns_links" ADD COLUMN "link_anchor" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "link_anchor";
  ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_link_anchor";
  ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "link_anchor";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_link_anchor";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_link_anchor";
  ALTER TABLE "pages_blocks_soutenir_home" DROP COLUMN "cta_primaire_link_anchor";
  ALTER TABLE "pages_blocks_soutenir_home" DROP COLUMN "cta_secondaire_link_anchor";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_link_anchor";
  ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_link_anchor";
  ALTER TABLE "navigation_header_nav_children" DROP COLUMN "link_anchor";
  ALTER TABLE "navigation_header_nav" DROP COLUMN "link_anchor";
  ALTER TABLE "navigation_header_buttons" DROP COLUMN "link_anchor";
  ALTER TABLE "navigation_footer_columns_links" DROP COLUMN "link_anchor";`)
}

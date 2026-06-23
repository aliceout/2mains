import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Généralisation du linkField : remplace les champs `href` (text simple)
// par un groupe `link` (type page/custom + relation Pages + URL libre +
// externe). Permet à Audrey de sélectionner une Page dans une liste au
// lieu de taper l'URL à la main.
//
// Backfill obligatoire AVANT les DROP COLUMN : la prod a des CTAs/cartes/
// portraits/hero avec href + externe remplis. On les copie en
// link_type='custom' + link_url=<href> + link_externe=<externe> pour
// préserver la data. Sans backfill, le DROP COLUMN perdrait tout.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Schéma : enums + ADD COLUMN + contraintes + index (généré par Drizzle)
  await db.execute(sql`
    CREATE TYPE "public"."enum_pages_blocks_cartes_cartes_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_formats_formats_cta_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_portraits_personnes_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_cta_cta_primaire_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_blocks_cta_cta_secondaire_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_hero_cta_primaire_link_type" AS ENUM('page', 'custom');
    CREATE TYPE "public"."enum_pages_hero_cta_secondaire_link_type" AS ENUM('page', 'custom');
    ALTER TABLE "navigation_header_nav_children" ALTER COLUMN "link_type" SET DEFAULT 'page';
    ALTER TABLE "navigation_header_nav" ALTER COLUMN "link_type" SET DEFAULT 'page';
    ALTER TABLE "navigation_header_buttons" ALTER COLUMN "link_type" SET DEFAULT 'page';
    ALTER TABLE "navigation_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'page';
    ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "link_type" "enum_pages_blocks_cartes_cartes_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "link_page_id" integer;
    ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "link_url" varchar;
    ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_link_type" "enum_pages_blocks_formats_formats_cta_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_link_page_id" integer;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_link_url" varchar;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_link_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "link_type" "enum_pages_blocks_portraits_personnes_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "link_page_id" integer;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "link_url" varchar;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_link_type" "enum_pages_blocks_cta_cta_primaire_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_link_page_id" integer;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_link_url" varchar;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_link_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_link_type" "enum_pages_blocks_cta_cta_secondaire_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_link_page_id" integer;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_link_url" varchar;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_link_externe" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_link_type" "enum_pages_hero_cta_primaire_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_link_page_id" integer;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_link_url" varchar;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_link_externe" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_link_type" "enum_pages_hero_cta_secondaire_link_type" DEFAULT 'page' NOT NULL;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_link_page_id" integer;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_link_url" varchar;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_link_externe" boolean DEFAULT false;
    ALTER TABLE "navigation_header_nav_children" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "navigation_header_nav" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "navigation_header_buttons" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "navigation_footer_columns_links" ADD COLUMN "link_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_cartes_cartes" ADD CONSTRAINT "pages_blocks_cartes_cartes_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_formats_formats" ADD CONSTRAINT "pages_blocks_formats_formats_cta_link_page_id_pages_id_fk" FOREIGN KEY ("cta_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD CONSTRAINT "pages_blocks_portraits_personnes_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_cta_primaire_link_page_id_pages_id_fk" FOREIGN KEY ("cta_primaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_cta_secondaire_link_page_id_pages_id_fk" FOREIGN KEY ("cta_secondaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_cta_primaire_link_page_id_pages_id_fk" FOREIGN KEY ("hero_cta_primaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    ALTER TABLE "pages" ADD CONSTRAINT "pages_hero_cta_secondaire_link_page_id_pages_id_fk" FOREIGN KEY ("hero_cta_secondaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
    CREATE INDEX "pages_blocks_cartes_cartes_link_link_page_idx" ON "pages_blocks_cartes_cartes" USING btree ("link_page_id");
    CREATE INDEX "pages_blocks_formats_formats_cta_link_cta_link_page_idx" ON "pages_blocks_formats_formats" USING btree ("cta_link_page_id");
    CREATE INDEX "pages_blocks_portraits_personnes_link_link_page_idx" ON "pages_blocks_portraits_personnes" USING btree ("link_page_id");
    CREATE INDEX "pages_blocks_cta_cta_primaire_link_cta_primaire_link_pag_idx" ON "pages_blocks_cta" USING btree ("cta_primaire_link_page_id");
    CREATE INDEX "pages_blocks_cta_cta_secondaire_link_cta_secondaire_link_idx" ON "pages_blocks_cta" USING btree ("cta_secondaire_link_page_id");
    CREATE INDEX "pages_hero_cta_primaire_link_hero_cta_primaire_link_page_idx" ON "pages" USING btree ("hero_cta_primaire_link_page_id");
    CREATE INDEX "pages_hero_cta_secondaire_link_hero_cta_secondaire_link__idx" ON "pages" USING btree ("hero_cta_secondaire_link_page_id");
  `)

  // 2. Backfill : copie href + externe (anciens) vers link_url + link_externe + link_type='custom' (nouveaux).
  //    On force type='custom' parce que les anciennes données sont des URLs / chemins libres, pas des
  //    relations vers Pages. Audrey peut basculer manuellement vers type='page' via l'admin par la suite.
  await db.execute(sql`
    UPDATE "pages_blocks_cartes_cartes"
       SET "link_type" = 'custom', "link_url" = "href"
     WHERE "href" IS NOT NULL AND "href" <> '';

    UPDATE "pages_blocks_formats_formats"
       SET "cta_link_type" = 'custom',
           "cta_link_url" = "cta_href",
           "cta_link_externe" = COALESCE("cta_externe", false)
     WHERE "cta_href" IS NOT NULL AND "cta_href" <> '';

    UPDATE "pages_blocks_portraits_personnes"
       SET "link_type" = 'custom', "link_url" = "lien"
     WHERE "lien" IS NOT NULL AND "lien" <> '';

    UPDATE "pages_blocks_cta"
       SET "cta_primaire_link_type" = 'custom',
           "cta_primaire_link_url" = "cta_primaire_href",
           "cta_primaire_link_externe" = COALESCE("cta_primaire_externe", false)
     WHERE "cta_primaire_href" IS NOT NULL AND "cta_primaire_href" <> '';

    UPDATE "pages_blocks_cta"
       SET "cta_secondaire_link_type" = 'custom',
           "cta_secondaire_link_url" = "cta_secondaire_href",
           "cta_secondaire_link_externe" = COALESCE("cta_secondaire_externe", false)
     WHERE "cta_secondaire_href" IS NOT NULL AND "cta_secondaire_href" <> '';

    UPDATE "pages"
       SET "hero_cta_primaire_link_type" = 'custom',
           "hero_cta_primaire_link_url" = "hero_cta_primaire_href",
           "hero_cta_primaire_link_externe" = COALESCE("hero_cta_primaire_externe", false)
     WHERE "hero_cta_primaire_href" IS NOT NULL AND "hero_cta_primaire_href" <> '';

    UPDATE "pages"
       SET "hero_cta_secondaire_link_type" = 'custom',
           "hero_cta_secondaire_link_url" = "hero_cta_secondaire_href",
           "hero_cta_secondaire_link_externe" = COALESCE("hero_cta_secondaire_externe", false)
     WHERE "hero_cta_secondaire_href" IS NOT NULL AND "hero_cta_secondaire_href" <> '';
  `)

  // 3. DROP des anciennes colonnes — APRÈS le backfill, sinon perte de data.
  await db.execute(sql`
    ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "href";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_href";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_externe";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "lien";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_href";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_externe";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_href";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_externe";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_href";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_externe";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_href";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_externe";
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "pages_blocks_cartes_cartes" DROP CONSTRAINT "pages_blocks_cartes_cartes_link_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_formats_formats" DROP CONSTRAINT "pages_blocks_formats_formats_cta_link_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP CONSTRAINT "pages_blocks_portraits_personnes_link_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_cta_primaire_link_page_id_pages_id_fk";
    ALTER TABLE "pages_blocks_cta" DROP CONSTRAINT "pages_blocks_cta_cta_secondaire_link_page_id_pages_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_cta_primaire_link_page_id_pages_id_fk";
    ALTER TABLE "pages" DROP CONSTRAINT "pages_hero_cta_secondaire_link_page_id_pages_id_fk";
    DROP INDEX "pages_blocks_cartes_cartes_link_link_page_idx";
    DROP INDEX "pages_blocks_formats_formats_cta_link_cta_link_page_idx";
    DROP INDEX "pages_blocks_portraits_personnes_link_link_page_idx";
    DROP INDEX "pages_blocks_cta_cta_primaire_link_cta_primaire_link_pag_idx";
    DROP INDEX "pages_blocks_cta_cta_secondaire_link_cta_secondaire_link_idx";
    DROP INDEX "pages_hero_cta_primaire_link_hero_cta_primaire_link_page_idx";
    DROP INDEX "pages_hero_cta_secondaire_link_hero_cta_secondaire_link__idx";
    ALTER TABLE "navigation_header_nav_children" ALTER COLUMN "link_type" SET DEFAULT 'custom';
    ALTER TABLE "navigation_header_nav" ALTER COLUMN "link_type" SET DEFAULT 'custom';
    ALTER TABLE "navigation_header_buttons" ALTER COLUMN "link_type" SET DEFAULT 'custom';
    ALTER TABLE "navigation_footer_columns_links" ALTER COLUMN "link_type" SET DEFAULT 'custom';
    ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "href" varchar;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_href" varchar;
    ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "cta_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "lien" varchar;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_href" varchar;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_primaire_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_href" varchar;
    ALTER TABLE "pages_blocks_cta" ADD COLUMN "cta_secondaire_externe" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_href" varchar;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_primaire_externe" boolean DEFAULT false;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_href" varchar;
    ALTER TABLE "pages" ADD COLUMN "hero_cta_secondaire_externe" boolean DEFAULT false;
    ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "link_type";
    ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "link_page_id";
    ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "link_url";
    ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "link_externe";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_link_type";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_link_page_id";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_link_url";
    ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "cta_link_externe";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "link_type";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "link_page_id";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "link_url";
    ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "link_externe";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_link_type";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_link_page_id";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_link_url";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_primaire_link_externe";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_link_type";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_link_page_id";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_link_url";
    ALTER TABLE "pages_blocks_cta" DROP COLUMN "cta_secondaire_link_externe";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_link_type";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_link_page_id";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_link_url";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_primaire_link_externe";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_link_type";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_link_page_id";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_link_url";
    ALTER TABLE "pages" DROP COLUMN "hero_cta_secondaire_link_externe";
    ALTER TABLE "navigation_header_nav_children" DROP COLUMN "link_externe";
    ALTER TABLE "navigation_header_nav" DROP COLUMN "link_externe";
    ALTER TABLE "navigation_header_buttons" DROP COLUMN "link_externe";
    ALTER TABLE "navigation_footer_columns_links" DROP COLUMN "link_externe";
    DROP TYPE "public"."enum_pages_blocks_cartes_cartes_link_type";
    DROP TYPE "public"."enum_pages_blocks_formats_formats_cta_link_type";
    DROP TYPE "public"."enum_pages_blocks_portraits_personnes_link_type";
    DROP TYPE "public"."enum_pages_blocks_cta_cta_primaire_link_type";
    DROP TYPE "public"."enum_pages_blocks_cta_cta_secondaire_link_type";
    DROP TYPE "public"."enum_pages_hero_cta_primaire_link_type";
    DROP TYPE "public"."enum_pages_hero_cta_secondaire_link_type";
  `)
}

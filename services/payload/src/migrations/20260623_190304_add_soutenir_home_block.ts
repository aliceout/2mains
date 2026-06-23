import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_soutenir_home_cta_primaire_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_pages_blocks_soutenir_home_cta_secondaire_link_type" AS ENUM('page', 'custom');
  CREATE TABLE "pages_blocks_soutenir_home" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"eyebrow" varchar DEFAULT '— Soutenir',
  	"titre" varchar NOT NULL,
  	"corps_rich" jsonb,
  	"cta_primaire_label" varchar,
  	"cta_primaire_link_type" "enum_pages_blocks_soutenir_home_cta_primaire_link_type" DEFAULT 'page' NOT NULL,
  	"cta_primaire_link_page_id" integer,
  	"cta_primaire_link_url" varchar,
  	"cta_primaire_link_externe" boolean DEFAULT false,
  	"cta_secondaire_label" varchar,
  	"cta_secondaire_link_type" "enum_pages_blocks_soutenir_home_cta_secondaire_link_type" DEFAULT 'page' NOT NULL,
  	"cta_secondaire_link_page_id" integer,
  	"cta_secondaire_link_url" varchar,
  	"cta_secondaire_link_externe" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_soutenir_home" ADD CONSTRAINT "pages_blocks_soutenir_home_cta_primaire_link_page_id_pages_id_fk" FOREIGN KEY ("cta_primaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_soutenir_home" ADD CONSTRAINT "pages_blocks_soutenir_home_cta_secondaire_link_page_id_pages_id_fk" FOREIGN KEY ("cta_secondaire_link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_soutenir_home" ADD CONSTRAINT "pages_blocks_soutenir_home_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_soutenir_home_order_idx" ON "pages_blocks_soutenir_home" USING btree ("_order");
  CREATE INDEX "pages_blocks_soutenir_home_parent_id_idx" ON "pages_blocks_soutenir_home" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_soutenir_home_path_idx" ON "pages_blocks_soutenir_home" USING btree ("_path");
  CREATE INDEX "pages_blocks_soutenir_home_cta_primaire_link_cta_primair_idx" ON "pages_blocks_soutenir_home" USING btree ("cta_primaire_link_page_id");
  CREATE INDEX "pages_blocks_soutenir_home_cta_secondaire_link_cta_secon_idx" ON "pages_blocks_soutenir_home" USING btree ("cta_secondaire_link_page_id");`)

  // Seed du bloc dans la page Accueil avec les valeurs précédemment
  // hardcodées dans src/pages/index.astro (titre, paragraphe, boutons).
  // L'URL HelloAsso reste codée en dur ici : c'est l'URL générique de
  // l'asso utilisée comme fallback ; Audrey la changera via l'admin
  // si besoin (champ "Bouton principal > Destination > URL libre").
  // Skip si la page accueil n'existe pas (deploy fresh) ou si le bloc
  // est déjà présent (re-run).
  await db.execute(sql`
    INSERT INTO "pages_blocks_soutenir_home" (
      "_order", "_parent_id", "_path", "id",
      "eyebrow", "titre", "corps_rich",
      "cta_primaire_label", "cta_primaire_link_type", "cta_primaire_link_url", "cta_primaire_link_externe",
      "cta_secondaire_label", "cta_secondaire_link_type", "cta_secondaire_link_url", "cta_secondaire_link_externe"
    )
    SELECT
      99,
      p.id,
      'sections',
      gen_random_uuid()::varchar,
      '— Soutenir',
      'L''association tient debout grâce à *vous*.',
      '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":null,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":null,"textStyle":"","textFormat":0,"children":[{"mode":"normal","text":"Adhérer, donner ou devenir bénévole — chaque engagement compte. Un don de 50 € permet à une femme de bénéficier d''une séance.","type":"text","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
      'Faire un don',
      'custom',
      'https://www.helloasso.com/associations/2mains-de-femmes',
      true,
      'Devenir bénévole',
      'custom',
      '/benevolat',
      false
    FROM "pages" p
    WHERE p.slug = 'accueil'
      AND NOT EXISTS (
        SELECT 1 FROM "pages_blocks_soutenir_home" sh WHERE sh."_parent_id" = p.id
      );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_soutenir_home" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_soutenir_home_cta_primaire_link_type";
  DROP TYPE "public"."enum_pages_blocks_soutenir_home_cta_secondaire_link_type";`)
}

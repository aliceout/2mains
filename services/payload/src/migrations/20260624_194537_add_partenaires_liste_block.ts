import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_liste_partenaires" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre_financeurs" varchar DEFAULT 'Nos financeurs',
  	"titre_partenaires" varchar DEFAULT 'Nos partenaires associatifs et médico-sociaux',
  	"texte_partenaires" varchar,
  	"titre_reseaux" varchar DEFAULT 'Nos réseaux d''accompagnement',
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_liste_partenaires" ADD CONSTRAINT "pages_blocks_liste_partenaires_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_liste_partenaires_order_idx" ON "pages_blocks_liste_partenaires" USING btree ("_order");
  CREATE INDEX "pages_blocks_liste_partenaires_parent_id_idx" ON "pages_blocks_liste_partenaires" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_liste_partenaires_path_idx" ON "pages_blocks_liste_partenaires" USING btree ("_path");`)

  // Seed de la page financeurs : reproduit l'état précédemment hardcodé
  // dans src/pages/financeurs.astro (bloc liste-partenaires + bandeau CTA
  // « Vous souhaitez nous soutenir ? »). Idempotent : skip si la page a
  // déjà un bloc liste-partenaires. Les titres reprennent les valeurs
  // hardcodées ; le texte additionnel sous les partenaires associatifs
  // est repris tel quel.
  await db.execute(sql`
    INSERT INTO "pages_blocks_liste_partenaires" (
      "_order", "_parent_id", "_path", "id",
      "titre_financeurs", "titre_partenaires", "texte_partenaires", "titre_reseaux"
    )
    SELECT
      1, p.id, 'sections', gen_random_uuid()::varchar,
      'Nos financeurs',
      'Nos partenaires associatifs et médico-sociaux',
      'À ces partenaires s''ajoutent les centres sociaux, les conciergeries sociales et les associations de quartier qui repèrent et orientent les femmes concernées sur les quartiers prioritaires de la métropole lyonnaise.',
      'Nos réseaux d''accompagnement'
    FROM "pages" p
    WHERE p.slug = 'financeurs'
      AND NOT EXISTS (
        SELECT 1 FROM "pages_blocks_liste_partenaires" x WHERE x."_parent_id" = p.id
      );
  `)

  // Bandeau « Vous souhaitez nous soutenir ? » : bloc CTA fond violet.
  // L'original avait 3 liens inline égaux (Nous écrire · Mécénat · Faire
  // un don) — on les met dans le corps_rich (Lexical) plutôt qu'en boutons
  // (le CTA n'en a que 2), pour ne perdre aucun lien et rester fidèle.
  await db.execute(sql`
    INSERT INTO "pages_blocks_cta" (
      "_order", "_parent_id", "_path", "id",
      "fond", "titre", "corps_rich"
    )
    SELECT
      2, p.id, 'sections', gen_random_uuid()::varchar,
      'violet',
      'Vous souhaitez nous soutenir ?',
      '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":null,"children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":null,"textStyle":"","textFormat":0,"children":[{"mode":"normal","text":"Collectivité, entreprise, fondation, réseau ou structure associative : parlons-nous.","type":"text","style":"","detail":0,"format":0,"version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":null,"textStyle":"","textFormat":0,"children":[{"type":"link","fields":{"linkType":"custom","url":"/contact","newTab":false},"format":"","indent":0,"version":3,"direction":null,"children":[{"mode":"normal","text":"Nous écrire","type":"text","style":"","detail":0,"format":0,"version":1}]},{"mode":"normal","text":"   ·   ","type":"text","style":"","detail":0,"format":0,"version":1},{"type":"link","fields":{"linkType":"custom","url":"/mecenat","newTab":false},"format":"","indent":0,"version":3,"direction":null,"children":[{"mode":"normal","text":"Mécénat","type":"text","style":"","detail":0,"format":0,"version":1}]},{"mode":"normal","text":"   ·   ","type":"text","style":"","detail":0,"format":0,"version":1},{"type":"link","fields":{"linkType":"custom","url":"/dons","newTab":false},"format":"","indent":0,"version":3,"direction":null,"children":[{"mode":"normal","text":"Faire un don","type":"text","style":"","detail":0,"format":0,"version":1}]}]}]}}'::jsonb
    FROM "pages" p
    WHERE p.slug = 'financeurs'
      AND NOT EXISTS (
        SELECT 1 FROM "pages_blocks_cta" x WHERE x."_parent_id" = p.id
      );
  `)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_liste_partenaires" CASCADE;`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_prose" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_callout" DROP COLUMN "body";
  ALTER TABLE "pages_blocks_lettre" DROP COLUMN "corps";
  ALTER TABLE "pages_blocks_citation" DROP COLUMN "citation";
  ALTER TABLE "pages_blocks_citation_large" DROP COLUMN "citation";
  ALTER TABLE "pages_blocks_stat_majeste" DROP COLUMN "texte";
  ALTER TABLE "pages_blocks_chiffre_detail" DROP COLUMN "texte";
  ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_valeurs_valeurs" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_etapes_etapes" DROP COLUMN "description";
  ALTER TABLE "pages_blocks_faq_questions" DROP COLUMN "reponse";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_deux_colonnes" DROP COLUMN "texte";
  ALTER TABLE "pages_blocks_texte_photo" DROP COLUMN "texte";
  ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "bio";
  ALTER TABLE "pages_blocks_timeline_etapes" DROP COLUMN "texte";
  ALTER TABLE "pages_blocks_equipe" DROP COLUMN "intro";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "corps";
  ALTER TABLE "actualites" DROP COLUMN "description";
  ALTER TABLE "actualites" DROP COLUMN "body";
  ALTER TABLE "evenements" DROP COLUMN "body";
  ALTER TABLE "temoignages" DROP COLUMN "citation";
  ALTER TABLE "identite" DROP COLUMN "mission";
  ALTER TABLE "banderole_urgence" DROP COLUMN "message";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_prose" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_callout" ADD COLUMN "body" varchar;
  ALTER TABLE "pages_blocks_lettre" ADD COLUMN "corps" varchar;
  ALTER TABLE "pages_blocks_citation" ADD COLUMN "citation" varchar;
  ALTER TABLE "pages_blocks_citation_large" ADD COLUMN "citation" varchar;
  ALTER TABLE "pages_blocks_stat_majeste" ADD COLUMN "texte" varchar;
  ALTER TABLE "pages_blocks_chiffre_detail" ADD COLUMN "texte" varchar;
  ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_valeurs_valeurs" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_etapes_etapes" ADD COLUMN "description" varchar;
  ALTER TABLE "pages_blocks_faq_questions" ADD COLUMN "reponse" varchar;
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_deux_colonnes" ADD COLUMN "texte" varchar;
  ALTER TABLE "pages_blocks_texte_photo" ADD COLUMN "texte" varchar;
  ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "bio" varchar;
  ALTER TABLE "pages_blocks_timeline_etapes" ADD COLUMN "texte" varchar;
  ALTER TABLE "pages_blocks_equipe" ADD COLUMN "intro" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "corps" varchar;
  ALTER TABLE "actualites" ADD COLUMN "description" varchar;
  ALTER TABLE "actualites" ADD COLUMN "body" varchar;
  ALTER TABLE "evenements" ADD COLUMN "body" varchar;
  ALTER TABLE "temoignages" ADD COLUMN "citation" varchar;
  ALTER TABLE "identite" ADD COLUMN "mission" varchar;
  ALTER TABLE "banderole_urgence" ADD COLUMN "message" varchar;`)
}

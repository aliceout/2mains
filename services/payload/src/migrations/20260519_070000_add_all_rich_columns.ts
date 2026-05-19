import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_callout" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "pages_blocks_lettre" ALTER COLUMN "corps" DROP NOT NULL;
  ALTER TABLE "pages_blocks_citation" ALTER COLUMN "citation" DROP NOT NULL;
  ALTER TABLE "pages_blocks_citation_large" ALTER COLUMN "citation" DROP NOT NULL;
  ALTER TABLE "pages_blocks_stat_majeste" ALTER COLUMN "texte" DROP NOT NULL;
  ALTER TABLE "pages_blocks_chiffre_detail" ALTER COLUMN "texte" DROP NOT NULL;
  ALTER TABLE "pages_blocks_cartes_cartes" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "pages_blocks_valeurs_valeurs" ALTER COLUMN "description" DROP NOT NULL;
  ALTER TABLE "pages_blocks_faq_questions" ALTER COLUMN "reponse" DROP NOT NULL;
  ALTER TABLE "pages_blocks_deux_colonnes" ALTER COLUMN "texte" DROP NOT NULL;
  ALTER TABLE "pages_blocks_texte_photo" ALTER COLUMN "texte" DROP NOT NULL;
  ALTER TABLE "actualites" ALTER COLUMN "body" DROP NOT NULL;
  ALTER TABLE "temoignages" ALTER COLUMN "citation" DROP NOT NULL;
  ALTER TABLE "identite" ALTER COLUMN "mission" DROP NOT NULL;
  ALTER TABLE "pages_blocks_callout" ADD COLUMN "body_rich" jsonb;
  ALTER TABLE "pages_blocks_lettre" ADD COLUMN "corps_rich" jsonb;
  ALTER TABLE "pages_blocks_citation" ADD COLUMN "citation_rich" jsonb;
  ALTER TABLE "pages_blocks_citation_large" ADD COLUMN "citation_rich" jsonb;
  ALTER TABLE "pages_blocks_stat_majeste" ADD COLUMN "texte_rich" jsonb;
  ALTER TABLE "pages_blocks_chiffre_detail" ADD COLUMN "texte_rich" jsonb;
  ALTER TABLE "pages_blocks_cartes_cartes" ADD COLUMN "description_rich" jsonb;
  ALTER TABLE "pages_blocks_valeurs_valeurs" ADD COLUMN "description_rich" jsonb;
  ALTER TABLE "pages_blocks_formats_formats" ADD COLUMN "description_rich" jsonb;
  ALTER TABLE "pages_blocks_etapes_etapes" ADD COLUMN "description_rich" jsonb;
  ALTER TABLE "pages_blocks_faq_questions" ADD COLUMN "reponse_rich" jsonb;
  ALTER TABLE "pages_blocks_stats" ADD COLUMN "intro_rich" jsonb;
  ALTER TABLE "pages_blocks_deux_colonnes" ADD COLUMN "texte_rich" jsonb;
  ALTER TABLE "pages_blocks_texte_photo" ADD COLUMN "texte_rich" jsonb;
  ALTER TABLE "pages_blocks_portraits_personnes" ADD COLUMN "bio_rich" jsonb;
  ALTER TABLE "pages_blocks_timeline_etapes" ADD COLUMN "texte_rich" jsonb;
  ALTER TABLE "pages_blocks_equipe" ADD COLUMN "intro_rich" jsonb;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "corps_rich" jsonb;
  ALTER TABLE "actualites" ADD COLUMN "description_rich" jsonb;
  ALTER TABLE "actualites" ADD COLUMN "body_rich" jsonb;
  ALTER TABLE "evenements" ADD COLUMN "body_rich" jsonb;
  ALTER TABLE "temoignages" ADD COLUMN "citation_rich" jsonb;
  ALTER TABLE "identite" ADD COLUMN "mission_rich" jsonb;
  ALTER TABLE "banderole_urgence" ADD COLUMN "message_rich" jsonb;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_callout" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "pages_blocks_lettre" ALTER COLUMN "corps" SET NOT NULL;
  ALTER TABLE "pages_blocks_citation" ALTER COLUMN "citation" SET NOT NULL;
  ALTER TABLE "pages_blocks_citation_large" ALTER COLUMN "citation" SET NOT NULL;
  ALTER TABLE "pages_blocks_stat_majeste" ALTER COLUMN "texte" SET NOT NULL;
  ALTER TABLE "pages_blocks_chiffre_detail" ALTER COLUMN "texte" SET NOT NULL;
  ALTER TABLE "pages_blocks_cartes_cartes" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "pages_blocks_valeurs_valeurs" ALTER COLUMN "description" SET NOT NULL;
  ALTER TABLE "pages_blocks_faq_questions" ALTER COLUMN "reponse" SET NOT NULL;
  ALTER TABLE "pages_blocks_deux_colonnes" ALTER COLUMN "texte" SET NOT NULL;
  ALTER TABLE "pages_blocks_texte_photo" ALTER COLUMN "texte" SET NOT NULL;
  ALTER TABLE "actualites" ALTER COLUMN "body" SET NOT NULL;
  ALTER TABLE "temoignages" ALTER COLUMN "citation" SET NOT NULL;
  ALTER TABLE "identite" ALTER COLUMN "mission" SET NOT NULL;
  ALTER TABLE "pages_blocks_callout" DROP COLUMN "body_rich";
  ALTER TABLE "pages_blocks_lettre" DROP COLUMN "corps_rich";
  ALTER TABLE "pages_blocks_citation" DROP COLUMN "citation_rich";
  ALTER TABLE "pages_blocks_citation_large" DROP COLUMN "citation_rich";
  ALTER TABLE "pages_blocks_stat_majeste" DROP COLUMN "texte_rich";
  ALTER TABLE "pages_blocks_chiffre_detail" DROP COLUMN "texte_rich";
  ALTER TABLE "pages_blocks_cartes_cartes" DROP COLUMN "description_rich";
  ALTER TABLE "pages_blocks_valeurs_valeurs" DROP COLUMN "description_rich";
  ALTER TABLE "pages_blocks_formats_formats" DROP COLUMN "description_rich";
  ALTER TABLE "pages_blocks_etapes_etapes" DROP COLUMN "description_rich";
  ALTER TABLE "pages_blocks_faq_questions" DROP COLUMN "reponse_rich";
  ALTER TABLE "pages_blocks_stats" DROP COLUMN "intro_rich";
  ALTER TABLE "pages_blocks_deux_colonnes" DROP COLUMN "texte_rich";
  ALTER TABLE "pages_blocks_texte_photo" DROP COLUMN "texte_rich";
  ALTER TABLE "pages_blocks_portraits_personnes" DROP COLUMN "bio_rich";
  ALTER TABLE "pages_blocks_timeline_etapes" DROP COLUMN "texte_rich";
  ALTER TABLE "pages_blocks_equipe" DROP COLUMN "intro_rich";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "corps_rich";
  ALTER TABLE "actualites" DROP COLUMN "description_rich";
  ALTER TABLE "actualites" DROP COLUMN "body_rich";
  ALTER TABLE "evenements" DROP COLUMN "body_rich";
  ALTER TABLE "temoignages" DROP COLUMN "citation_rich";
  ALTER TABLE "identite" DROP COLUMN "mission_rich";
  ALTER TABLE "banderole_urgence" DROP COLUMN "message_rich";`)
}

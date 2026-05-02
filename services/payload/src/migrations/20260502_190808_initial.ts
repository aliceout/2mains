import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_prose_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_callout_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_callout_ton" AS ENUM('info', 'important', 'astuce', 'note');
  CREATE TYPE "public"."enum_pages_blocks_lettre_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_lettre_variant" AS ENUM('orange', 'violet');
  CREATE TYPE "public"."enum_pages_blocks_citation_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_citation_variant" AS ENUM('beige', 'violet', 'paper');
  CREATE TYPE "public"."enum_pages_blocks_citation_large_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_citation_large_variant" AS ENUM('orange', 'violet', 'beige', 'paper');
  CREATE TYPE "public"."enum_pages_blocks_stat_majeste_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_stat_majeste_variant" AS ENUM('orange', 'violet');
  CREATE TYPE "public"."enum_pages_blocks_chiffre_detail_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_chiffre_detail_alignement" AS ENUM('gauche', 'droite');
  CREATE TYPE "public"."enum_pages_blocks_chiffre_detail_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_cartes_cartes_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_cartes_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_cartes_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_valeurs_valeurs_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_valeurs_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_formats_formats_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_formats_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_formats_colonnes" AS ENUM('2', '3');
  CREATE TYPE "public"."enum_pages_blocks_etapes_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_etapes_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_faq_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_stats_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_deux_colonnes_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_deux_colonnes_picto_couleur" AS ENUM('orange', 'violet', 'magenta', 'vert', 'bleu', 'beige');
  CREATE TYPE "public"."enum_pages_blocks_texte_photo_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_texte_photo_position" AS ENUM('droite', 'gauche');
  CREATE TYPE "public"."enum_pages_blocks_texte_photo_ratio" AS ENUM('50-50', '2-tiers-texte', '2-tiers-image');
  CREATE TYPE "public"."enum_pages_blocks_figure_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_figure_taille" AS ENUM('petite', 'moyenne', 'grande');
  CREATE TYPE "public"."enum_pages_blocks_galerie_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_galerie_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_bandeau_image_hauteur" AS ENUM('petite', 'moyenne', 'grande');
  CREATE TYPE "public"."enum_pages_blocks_bandeau_image_position_texte" AS ENUM('gauche', 'centre', 'droite');
  CREATE TYPE "public"."enum_pages_blocks_bandeau_image_position_verticale" AS ENUM('haut', 'milieu', 'bas');
  CREATE TYPE "public"."enum_pages_blocks_portraits_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_portraits_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_portraits_forme" AS ENUM('rond', 'carre');
  CREATE TYPE "public"."enum_pages_blocks_timeline_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_timeline_alignement" AS ENUM('vertical', 'alterne');
  CREATE TYPE "public"."enum_pages_blocks_temoignages_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_temoignages_contexte" AS ENUM('participante', 'partenaire', 'professionnelle');
  CREATE TYPE "public"."enum_pages_blocks_equipe_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_blocks_equipe_forme" AS ENUM('rond', 'carre');
  CREATE TYPE "public"."enum_pages_blocks_equipe_colonnes" AS ENUM('2', '3', '4');
  CREATE TYPE "public"."enum_pages_blocks_cta_fond" AS ENUM('paper', 'beige', 'violet', 'orange', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_pages_hero_variant" AS ENUM('beige', 'orange', 'violet', 'magenta', 'vert', 'bleu');
  CREATE TYPE "public"."enum_evenements_public" AS ENUM('tout public', 'professionnels', 'femmes concernées', 'adhérents');
  CREATE TYPE "public"."enum_temoignages_contexte" AS ENUM('participante', 'partenaire', 'professionnelle');
  CREATE TYPE "public"."enum_partenaires_type" AS ENUM('financeur public', 'financeur privé', 'partenaire associatif', 'réseau');
  CREATE TYPE "public"."enum_documents_categorie" AS ENUM('projet associatif', 'rapport d''activité', 'ressource', 'communication', 'présentation');
  CREATE TYPE "public"."enum_site_banderole_urgence_couleur" AS ENUM('orange', 'violet', 'magenta');
  CREATE TABLE "pages_blocks_prose" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_prose_fond",
  	"body" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_callout" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fond" "enum_pages_blocks_callout_fond",
  	"ton" "enum_pages_blocks_callout_ton" DEFAULT 'info' NOT NULL,
  	"titre" varchar,
  	"body" varchar NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lettre" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_lettre_fond",
  	"ouverture" varchar DEFAULT 'Bonjour,',
  	"corps" varchar NOT NULL,
  	"signature" varchar DEFAULT '— l''équipe.',
  	"variant" "enum_pages_blocks_lettre_variant" DEFAULT 'orange' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_citation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fond" "enum_pages_blocks_citation_fond",
  	"citation" varchar NOT NULL,
  	"auteur" varchar NOT NULL,
  	"role" varchar,
  	"variant" "enum_pages_blocks_citation_variant" DEFAULT 'beige' NOT NULL,
  	"fictif" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_citation_large" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fond" "enum_pages_blocks_citation_large_fond",
  	"citation" varchar NOT NULL,
  	"auteur" varchar,
  	"role" varchar,
  	"variant" "enum_pages_blocks_citation_large_variant" DEFAULT 'paper' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stat_majeste" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_stat_majeste_fond",
  	"chiffre" varchar NOT NULL,
  	"texte" varchar NOT NULL,
  	"source" varchar,
  	"eyebrow" varchar DEFAULT '— constat',
  	"variant" "enum_pages_blocks_stat_majeste_variant" DEFAULT 'orange' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_chiffre_detail" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_chiffre_detail_fond",
  	"chiffre" varchar NOT NULL,
  	"texte" varchar NOT NULL,
  	"source" varchar,
  	"alignement" "enum_pages_blocks_chiffre_detail_alignement" DEFAULT 'gauche' NOT NULL,
  	"couleur" "enum_pages_blocks_chiffre_detail_couleur",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cartes_cartes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"href" varchar,
  	"cta" varchar,
  	"couleur" "enum_pages_blocks_cartes_cartes_couleur"
  );
  
  CREATE TABLE "pages_blocks_cartes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_cartes_fond",
  	"colonnes" "enum_pages_blocks_cartes_colonnes" DEFAULT '3' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_valeurs_valeurs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"couleur" "enum_pages_blocks_valeurs_valeurs_couleur"
  );
  
  CREATE TABLE "pages_blocks_valeurs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_valeurs_fond",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_formats_formats_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"point" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_formats_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"description" varchar,
  	"couleur" "enum_pages_blocks_formats_formats_couleur",
  	"cta_label" varchar,
  	"cta_href" varchar,
  	"cta_externe" boolean DEFAULT false
  );
  
  CREATE TABLE "pages_blocks_formats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_formats_fond",
  	"colonnes" "enum_pages_blocks_formats_colonnes" DEFAULT '2' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_etapes_etapes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar NOT NULL,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_etapes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_etapes_fond",
  	"couleur" "enum_pages_blocks_etapes_couleur",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_faq_questions" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar NOT NULL,
  	"reponse" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_faq_fond",
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"valeur" varchar NOT NULL,
  	"legende" varchar NOT NULL,
  	"source" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_stats_fond",
  	"intro" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_deux_colonnes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_deux_colonnes_fond",
  	"inverse" boolean DEFAULT false,
  	"texte" varchar NOT NULL,
  	"picto_couleur" "enum_pages_blocks_deux_colonnes_picto_couleur" DEFAULT 'orange' NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_texte_photo" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_texte_photo_fond",
  	"texte" varchar NOT NULL,
  	"image_id" integer,
  	"image_alt" varchar,
  	"image_legende" varchar,
  	"image_credit" varchar,
  	"position" "enum_pages_blocks_texte_photo_position" DEFAULT 'droite' NOT NULL,
  	"ratio" "enum_pages_blocks_texte_photo_ratio" DEFAULT '50-50' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_figure" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fond" "enum_pages_blocks_figure_fond",
  	"image_id" integer,
  	"alt" varchar,
  	"legende" varchar,
  	"credit" varchar,
  	"taille" "enum_pages_blocks_figure_taille" DEFAULT 'moyenne' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_galerie_images" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"legende" varchar
  );
  
  CREATE TABLE "pages_blocks_galerie" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_galerie_fond",
  	"colonnes" "enum_pages_blocks_galerie_colonnes" DEFAULT '3' NOT NULL,
  	"lightbox" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_bandeau_image" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"alt" varchar,
  	"titre" varchar NOT NULL,
  	"sous_titre" varchar,
  	"hauteur" "enum_pages_blocks_bandeau_image_hauteur" DEFAULT 'moyenne' NOT NULL,
  	"position_texte" "enum_pages_blocks_bandeau_image_position_texte" DEFAULT 'centre' NOT NULL,
  	"position_verticale" "enum_pages_blocks_bandeau_image_position_verticale" DEFAULT 'milieu' NOT NULL,
  	"scrim" boolean DEFAULT true,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_portraits_personnes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"nom" varchar NOT NULL,
  	"role" varchar,
  	"photo_id" integer,
  	"photo_alt" varchar,
  	"bio" varchar,
  	"lien" varchar,
  	"lien_label" varchar
  );
  
  CREATE TABLE "pages_blocks_portraits" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_portraits_fond",
  	"colonnes" "enum_pages_blocks_portraits_colonnes" DEFAULT '3' NOT NULL,
  	"forme" "enum_pages_blocks_portraits_forme" DEFAULT 'rond' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline_etapes" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" varchar NOT NULL,
  	"titre" varchar NOT NULL,
  	"texte" varchar,
  	"image_id" integer,
  	"image_alt" varchar
  );
  
  CREATE TABLE "pages_blocks_timeline" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar,
  	"fond" "enum_pages_blocks_timeline_fond",
  	"alignement" "enum_pages_blocks_timeline_alignement" DEFAULT 'vertical' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_temoignages_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_temoignages" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar DEFAULT 'Ce qu''elles en disent',
  	"fond" "enum_pages_blocks_temoignages_fond",
  	"contexte" "enum_pages_blocks_temoignages_contexte",
  	"limite" numeric DEFAULT 3 NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_equipe_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_equipe" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"titre" varchar DEFAULT 'Notre équipe',
  	"fond" "enum_pages_blocks_equipe_fond",
  	"intro" varchar,
  	"forme" "enum_pages_blocks_equipe_forme" DEFAULT 'rond' NOT NULL,
  	"colonnes" "enum_pages_blocks_equipe_colonnes" DEFAULT '4' NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_cta" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fond" "enum_pages_blocks_cta_fond",
  	"titre" varchar NOT NULL,
  	"corps" varchar,
  	"cta_primaire_label" varchar,
  	"cta_primaire_href" varchar,
  	"cta_primaire_externe" boolean DEFAULT false,
  	"cta_secondaire_label" varchar,
  	"cta_secondaire_href" varchar,
  	"cta_secondaire_externe" boolean DEFAULT false,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"noindex" boolean DEFAULT false,
  	"hero_enabled" boolean DEFAULT true,
  	"hero_titre" varchar,
  	"hero_sous_titre" varchar,
  	"hero_accroche" varchar,
  	"hero_variant" "enum_pages_hero_variant" DEFAULT 'beige',
  	"hero_cta_primaire_label" varchar,
  	"hero_cta_primaire_href" varchar,
  	"hero_cta_primaire_externe" boolean DEFAULT false,
  	"hero_cta_secondaire_label" varchar,
  	"hero_cta_secondaire_href" varchar,
  	"hero_cta_secondaire_externe" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "actualites_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar NOT NULL
  );
  
  CREATE TABLE "actualites" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"date" timestamp(3) with time zone NOT NULL,
  	"auteur" varchar,
  	"cover_id" integer,
  	"cover_alt" varchar,
  	"body" varchar NOT NULL,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "evenements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"date_debut" timestamp(3) with time zone NOT NULL,
  	"date_fin" timestamp(3) with time zone,
  	"lieu" varchar NOT NULL,
  	"adresse" varchar,
  	"cover_id" integer,
  	"public" "enum_evenements_public" NOT NULL,
  	"gratuit" boolean DEFAULT true,
  	"inscription_url" varchar,
  	"body" varchar,
  	"fictif" boolean DEFAULT false,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "equipe" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"nom" varchar NOT NULL,
  	"role" varchar NOT NULL,
  	"photo_id" integer,
  	"bio_courte" varchar,
  	"linkedin" varchar,
  	"ordre" numeric DEFAULT 0,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "temoignages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"auteur" varchar NOT NULL,
  	"role" varchar,
  	"contexte" "enum_temoignages_contexte" NOT NULL,
  	"photo_id" integer,
  	"citation" varchar NOT NULL,
  	"ordre" numeric DEFAULT 0,
  	"a_la_une" boolean DEFAULT false,
  	"fictif" boolean DEFAULT false,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "partenaires" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"nom" varchar NOT NULL,
  	"type" "enum_partenaires_type" NOT NULL,
  	"logo_id" integer,
  	"url" varchar,
  	"description_courte" varchar,
  	"ordre" numeric DEFAULT 0,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"titre" varchar NOT NULL,
  	"categorie" "enum_documents_categorie" NOT NULL,
  	"fichier_id" integer,
  	"date" timestamp(3) with time zone,
  	"description_courte" varchar,
  	"a_paraitre" boolean DEFAULT false,
  	"draft" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"pages_id" integer,
  	"actualites_id" integer,
  	"evenements_id" integer,
  	"equipe_id" integer,
  	"temoignages_id" integer,
  	"partenaires_id" integer,
  	"documents_id" integer,
  	"users_id" integer,
  	"media_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom_asso" varchar DEFAULT '2mains de femmes' NOT NULL,
  	"url" varchar DEFAULT 'https://2mainsdefemmes.org' NOT NULL,
  	"accroche_globale" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"directeur_publication" varchar NOT NULL,
  	"siren" varchar,
  	"rna" varchar,
  	"adresse" varchar,
  	"reseaux_facebook" varchar,
  	"reseaux_instagram" varchar,
  	"reseaux_linkedin" varchar,
  	"helloasso_don" varchar DEFAULT 'https://www.helloasso.com/associations/2mains-de-femmes',
  	"helloasso_adhesion" varchar,
  	"helloasso_newsletter" varchar,
  	"banderole_urgence_active" boolean DEFAULT false,
  	"banderole_urgence_message" varchar,
  	"banderole_urgence_couleur" "enum_site_banderole_urgence_couleur" DEFAULT 'orange',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "pages_blocks_prose" ADD CONSTRAINT "pages_blocks_prose_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_callout" ADD CONSTRAINT "pages_blocks_callout_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lettre" ADD CONSTRAINT "pages_blocks_lettre_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_citation" ADD CONSTRAINT "pages_blocks_citation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_citation_large" ADD CONSTRAINT "pages_blocks_citation_large_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stat_majeste" ADD CONSTRAINT "pages_blocks_stat_majeste_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_chiffre_detail" ADD CONSTRAINT "pages_blocks_chiffre_detail_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cartes_cartes" ADD CONSTRAINT "pages_blocks_cartes_cartes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_cartes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cartes" ADD CONSTRAINT "pages_blocks_cartes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_valeurs_valeurs" ADD CONSTRAINT "pages_blocks_valeurs_valeurs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_valeurs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_valeurs" ADD CONSTRAINT "pages_blocks_valeurs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_formats_formats_points" ADD CONSTRAINT "pages_blocks_formats_formats_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_formats_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_formats_formats" ADD CONSTRAINT "pages_blocks_formats_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_formats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_formats" ADD CONSTRAINT "pages_blocks_formats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_etapes_etapes" ADD CONSTRAINT "pages_blocks_etapes_etapes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_etapes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_etapes" ADD CONSTRAINT "pages_blocks_etapes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq_questions" ADD CONSTRAINT "pages_blocks_faq_questions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_faq" ADD CONSTRAINT "pages_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_stats" ADD CONSTRAINT "pages_blocks_stats_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_deux_colonnes" ADD CONSTRAINT "pages_blocks_deux_colonnes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_deux_colonnes" ADD CONSTRAINT "pages_blocks_deux_colonnes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_photo" ADD CONSTRAINT "pages_blocks_texte_photo_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_texte_photo" ADD CONSTRAINT "pages_blocks_texte_photo_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_figure" ADD CONSTRAINT "pages_blocks_figure_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_figure" ADD CONSTRAINT "pages_blocks_figure_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_images" ADD CONSTRAINT "pages_blocks_galerie_images_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie_images" ADD CONSTRAINT "pages_blocks_galerie_images_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_galerie"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_galerie" ADD CONSTRAINT "pages_blocks_galerie_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_bandeau_image" ADD CONSTRAINT "pages_blocks_bandeau_image_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_bandeau_image" ADD CONSTRAINT "pages_blocks_bandeau_image_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portraits_personnes" ADD CONSTRAINT "pages_blocks_portraits_personnes_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_portraits_personnes" ADD CONSTRAINT "pages_blocks_portraits_personnes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_portraits"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_portraits" ADD CONSTRAINT "pages_blocks_portraits_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_etapes" ADD CONSTRAINT "pages_blocks_timeline_etapes_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline_etapes" ADD CONSTRAINT "pages_blocks_timeline_etapes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_timeline"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_timeline" ADD CONSTRAINT "pages_blocks_timeline_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages_ids" ADD CONSTRAINT "pages_blocks_temoignages_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_temoignages" ADD CONSTRAINT "pages_blocks_temoignages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_equipe_ids" ADD CONSTRAINT "pages_blocks_equipe_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_equipe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_equipe" ADD CONSTRAINT "pages_blocks_equipe_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_cta" ADD CONSTRAINT "pages_blocks_cta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actualites_tags" ADD CONSTRAINT "actualites_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."actualites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "actualites" ADD CONSTRAINT "actualites_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "evenements" ADD CONSTRAINT "evenements_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "equipe" ADD CONSTRAINT "equipe_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "temoignages" ADD CONSTRAINT "temoignages_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "partenaires" ADD CONSTRAINT "partenaires_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "documents" ADD CONSTRAINT "documents_fichier_id_media_id_fk" FOREIGN KEY ("fichier_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_actualites_fk" FOREIGN KEY ("actualites_id") REFERENCES "public"."actualites"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_evenements_fk" FOREIGN KEY ("evenements_id") REFERENCES "public"."evenements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_equipe_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipe"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_temoignages_fk" FOREIGN KEY ("temoignages_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_partenaires_fk" FOREIGN KEY ("partenaires_id") REFERENCES "public"."partenaires"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_documents_fk" FOREIGN KEY ("documents_id") REFERENCES "public"."documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_prose_order_idx" ON "pages_blocks_prose" USING btree ("_order");
  CREATE INDEX "pages_blocks_prose_parent_id_idx" ON "pages_blocks_prose" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_prose_path_idx" ON "pages_blocks_prose" USING btree ("_path");
  CREATE INDEX "pages_blocks_callout_order_idx" ON "pages_blocks_callout" USING btree ("_order");
  CREATE INDEX "pages_blocks_callout_parent_id_idx" ON "pages_blocks_callout" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_callout_path_idx" ON "pages_blocks_callout" USING btree ("_path");
  CREATE INDEX "pages_blocks_lettre_order_idx" ON "pages_blocks_lettre" USING btree ("_order");
  CREATE INDEX "pages_blocks_lettre_parent_id_idx" ON "pages_blocks_lettre" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lettre_path_idx" ON "pages_blocks_lettre" USING btree ("_path");
  CREATE INDEX "pages_blocks_citation_order_idx" ON "pages_blocks_citation" USING btree ("_order");
  CREATE INDEX "pages_blocks_citation_parent_id_idx" ON "pages_blocks_citation" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_citation_path_idx" ON "pages_blocks_citation" USING btree ("_path");
  CREATE INDEX "pages_blocks_citation_large_order_idx" ON "pages_blocks_citation_large" USING btree ("_order");
  CREATE INDEX "pages_blocks_citation_large_parent_id_idx" ON "pages_blocks_citation_large" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_citation_large_path_idx" ON "pages_blocks_citation_large" USING btree ("_path");
  CREATE INDEX "pages_blocks_stat_majeste_order_idx" ON "pages_blocks_stat_majeste" USING btree ("_order");
  CREATE INDEX "pages_blocks_stat_majeste_parent_id_idx" ON "pages_blocks_stat_majeste" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stat_majeste_path_idx" ON "pages_blocks_stat_majeste" USING btree ("_path");
  CREATE INDEX "pages_blocks_chiffre_detail_order_idx" ON "pages_blocks_chiffre_detail" USING btree ("_order");
  CREATE INDEX "pages_blocks_chiffre_detail_parent_id_idx" ON "pages_blocks_chiffre_detail" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_chiffre_detail_path_idx" ON "pages_blocks_chiffre_detail" USING btree ("_path");
  CREATE INDEX "pages_blocks_cartes_cartes_order_idx" ON "pages_blocks_cartes_cartes" USING btree ("_order");
  CREATE INDEX "pages_blocks_cartes_cartes_parent_id_idx" ON "pages_blocks_cartes_cartes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cartes_order_idx" ON "pages_blocks_cartes" USING btree ("_order");
  CREATE INDEX "pages_blocks_cartes_parent_id_idx" ON "pages_blocks_cartes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cartes_path_idx" ON "pages_blocks_cartes" USING btree ("_path");
  CREATE INDEX "pages_blocks_valeurs_valeurs_order_idx" ON "pages_blocks_valeurs_valeurs" USING btree ("_order");
  CREATE INDEX "pages_blocks_valeurs_valeurs_parent_id_idx" ON "pages_blocks_valeurs_valeurs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_valeurs_order_idx" ON "pages_blocks_valeurs" USING btree ("_order");
  CREATE INDEX "pages_blocks_valeurs_parent_id_idx" ON "pages_blocks_valeurs" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_valeurs_path_idx" ON "pages_blocks_valeurs" USING btree ("_path");
  CREATE INDEX "pages_blocks_formats_formats_points_order_idx" ON "pages_blocks_formats_formats_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_formats_formats_points_parent_id_idx" ON "pages_blocks_formats_formats_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_formats_formats_order_idx" ON "pages_blocks_formats_formats" USING btree ("_order");
  CREATE INDEX "pages_blocks_formats_formats_parent_id_idx" ON "pages_blocks_formats_formats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_formats_order_idx" ON "pages_blocks_formats" USING btree ("_order");
  CREATE INDEX "pages_blocks_formats_parent_id_idx" ON "pages_blocks_formats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_formats_path_idx" ON "pages_blocks_formats" USING btree ("_path");
  CREATE INDEX "pages_blocks_etapes_etapes_order_idx" ON "pages_blocks_etapes_etapes" USING btree ("_order");
  CREATE INDEX "pages_blocks_etapes_etapes_parent_id_idx" ON "pages_blocks_etapes_etapes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_etapes_order_idx" ON "pages_blocks_etapes" USING btree ("_order");
  CREATE INDEX "pages_blocks_etapes_parent_id_idx" ON "pages_blocks_etapes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_etapes_path_idx" ON "pages_blocks_etapes" USING btree ("_path");
  CREATE INDEX "pages_blocks_faq_questions_order_idx" ON "pages_blocks_faq_questions" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_questions_parent_id_idx" ON "pages_blocks_faq_questions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_order_idx" ON "pages_blocks_faq" USING btree ("_order");
  CREATE INDEX "pages_blocks_faq_parent_id_idx" ON "pages_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_faq_path_idx" ON "pages_blocks_faq" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_stats_order_idx" ON "pages_blocks_stats_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_stats_parent_id_idx" ON "pages_blocks_stats_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_deux_colonnes_order_idx" ON "pages_blocks_deux_colonnes" USING btree ("_order");
  CREATE INDEX "pages_blocks_deux_colonnes_parent_id_idx" ON "pages_blocks_deux_colonnes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_deux_colonnes_path_idx" ON "pages_blocks_deux_colonnes" USING btree ("_path");
  CREATE INDEX "pages_blocks_deux_colonnes_image_idx" ON "pages_blocks_deux_colonnes" USING btree ("image_id");
  CREATE INDEX "pages_blocks_texte_photo_order_idx" ON "pages_blocks_texte_photo" USING btree ("_order");
  CREATE INDEX "pages_blocks_texte_photo_parent_id_idx" ON "pages_blocks_texte_photo" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_texte_photo_path_idx" ON "pages_blocks_texte_photo" USING btree ("_path");
  CREATE INDEX "pages_blocks_texte_photo_image_idx" ON "pages_blocks_texte_photo" USING btree ("image_id");
  CREATE INDEX "pages_blocks_figure_order_idx" ON "pages_blocks_figure" USING btree ("_order");
  CREATE INDEX "pages_blocks_figure_parent_id_idx" ON "pages_blocks_figure" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_figure_path_idx" ON "pages_blocks_figure" USING btree ("_path");
  CREATE INDEX "pages_blocks_figure_image_idx" ON "pages_blocks_figure" USING btree ("image_id");
  CREATE INDEX "pages_blocks_galerie_images_order_idx" ON "pages_blocks_galerie_images" USING btree ("_order");
  CREATE INDEX "pages_blocks_galerie_images_parent_id_idx" ON "pages_blocks_galerie_images" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_galerie_images_image_idx" ON "pages_blocks_galerie_images" USING btree ("image_id");
  CREATE INDEX "pages_blocks_galerie_order_idx" ON "pages_blocks_galerie" USING btree ("_order");
  CREATE INDEX "pages_blocks_galerie_parent_id_idx" ON "pages_blocks_galerie" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_galerie_path_idx" ON "pages_blocks_galerie" USING btree ("_path");
  CREATE INDEX "pages_blocks_bandeau_image_order_idx" ON "pages_blocks_bandeau_image" USING btree ("_order");
  CREATE INDEX "pages_blocks_bandeau_image_parent_id_idx" ON "pages_blocks_bandeau_image" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_bandeau_image_path_idx" ON "pages_blocks_bandeau_image" USING btree ("_path");
  CREATE INDEX "pages_blocks_bandeau_image_image_idx" ON "pages_blocks_bandeau_image" USING btree ("image_id");
  CREATE INDEX "pages_blocks_portraits_personnes_order_idx" ON "pages_blocks_portraits_personnes" USING btree ("_order");
  CREATE INDEX "pages_blocks_portraits_personnes_parent_id_idx" ON "pages_blocks_portraits_personnes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portraits_personnes_photo_idx" ON "pages_blocks_portraits_personnes" USING btree ("photo_id");
  CREATE INDEX "pages_blocks_portraits_order_idx" ON "pages_blocks_portraits" USING btree ("_order");
  CREATE INDEX "pages_blocks_portraits_parent_id_idx" ON "pages_blocks_portraits" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_portraits_path_idx" ON "pages_blocks_portraits" USING btree ("_path");
  CREATE INDEX "pages_blocks_timeline_etapes_order_idx" ON "pages_blocks_timeline_etapes" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_etapes_parent_id_idx" ON "pages_blocks_timeline_etapes" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_etapes_image_idx" ON "pages_blocks_timeline_etapes" USING btree ("image_id");
  CREATE INDEX "pages_blocks_timeline_order_idx" ON "pages_blocks_timeline" USING btree ("_order");
  CREATE INDEX "pages_blocks_timeline_parent_id_idx" ON "pages_blocks_timeline" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_timeline_path_idx" ON "pages_blocks_timeline" USING btree ("_path");
  CREATE INDEX "pages_blocks_temoignages_ids_order_idx" ON "pages_blocks_temoignages_ids" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_ids_parent_id_idx" ON "pages_blocks_temoignages_ids" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_order_idx" ON "pages_blocks_temoignages" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_parent_id_idx" ON "pages_blocks_temoignages" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_temoignages_path_idx" ON "pages_blocks_temoignages" USING btree ("_path");
  CREATE INDEX "pages_blocks_equipe_ids_order_idx" ON "pages_blocks_equipe_ids" USING btree ("_order");
  CREATE INDEX "pages_blocks_equipe_ids_parent_id_idx" ON "pages_blocks_equipe_ids" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_equipe_order_idx" ON "pages_blocks_equipe" USING btree ("_order");
  CREATE INDEX "pages_blocks_equipe_parent_id_idx" ON "pages_blocks_equipe" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_equipe_path_idx" ON "pages_blocks_equipe" USING btree ("_path");
  CREATE INDEX "pages_blocks_cta_order_idx" ON "pages_blocks_cta" USING btree ("_order");
  CREATE INDEX "pages_blocks_cta_parent_id_idx" ON "pages_blocks_cta" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_cta_path_idx" ON "pages_blocks_cta" USING btree ("_path");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "actualites_tags_order_idx" ON "actualites_tags" USING btree ("_order");
  CREATE INDEX "actualites_tags_parent_id_idx" ON "actualites_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "actualites_slug_idx" ON "actualites" USING btree ("slug");
  CREATE INDEX "actualites_cover_idx" ON "actualites" USING btree ("cover_id");
  CREATE INDEX "actualites_updated_at_idx" ON "actualites" USING btree ("updated_at");
  CREATE INDEX "actualites_created_at_idx" ON "actualites" USING btree ("created_at");
  CREATE UNIQUE INDEX "evenements_slug_idx" ON "evenements" USING btree ("slug");
  CREATE INDEX "evenements_cover_idx" ON "evenements" USING btree ("cover_id");
  CREATE INDEX "evenements_updated_at_idx" ON "evenements" USING btree ("updated_at");
  CREATE INDEX "evenements_created_at_idx" ON "evenements" USING btree ("created_at");
  CREATE UNIQUE INDEX "equipe_slug_idx" ON "equipe" USING btree ("slug");
  CREATE INDEX "equipe_photo_idx" ON "equipe" USING btree ("photo_id");
  CREATE INDEX "equipe_updated_at_idx" ON "equipe" USING btree ("updated_at");
  CREATE INDEX "equipe_created_at_idx" ON "equipe" USING btree ("created_at");
  CREATE UNIQUE INDEX "temoignages_slug_idx" ON "temoignages" USING btree ("slug");
  CREATE INDEX "temoignages_photo_idx" ON "temoignages" USING btree ("photo_id");
  CREATE INDEX "temoignages_updated_at_idx" ON "temoignages" USING btree ("updated_at");
  CREATE INDEX "temoignages_created_at_idx" ON "temoignages" USING btree ("created_at");
  CREATE UNIQUE INDEX "partenaires_slug_idx" ON "partenaires" USING btree ("slug");
  CREATE INDEX "partenaires_logo_idx" ON "partenaires" USING btree ("logo_id");
  CREATE INDEX "partenaires_updated_at_idx" ON "partenaires" USING btree ("updated_at");
  CREATE INDEX "partenaires_created_at_idx" ON "partenaires" USING btree ("created_at");
  CREATE UNIQUE INDEX "documents_slug_idx" ON "documents" USING btree ("slug");
  CREATE INDEX "documents_fichier_idx" ON "documents" USING btree ("fichier_id");
  CREATE INDEX "documents_updated_at_idx" ON "documents" USING btree ("updated_at");
  CREATE INDEX "documents_created_at_idx" ON "documents" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_actualites_id_idx" ON "payload_locked_documents_rels" USING btree ("actualites_id");
  CREATE INDEX "payload_locked_documents_rels_evenements_id_idx" ON "payload_locked_documents_rels" USING btree ("evenements_id");
  CREATE INDEX "payload_locked_documents_rels_equipe_id_idx" ON "payload_locked_documents_rels" USING btree ("equipe_id");
  CREATE INDEX "payload_locked_documents_rels_temoignages_id_idx" ON "payload_locked_documents_rels" USING btree ("temoignages_id");
  CREATE INDEX "payload_locked_documents_rels_partenaires_id_idx" ON "payload_locked_documents_rels" USING btree ("partenaires_id");
  CREATE INDEX "payload_locked_documents_rels_documents_id_idx" ON "payload_locked_documents_rels" USING btree ("documents_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_prose" CASCADE;
  DROP TABLE "pages_blocks_callout" CASCADE;
  DROP TABLE "pages_blocks_lettre" CASCADE;
  DROP TABLE "pages_blocks_citation" CASCADE;
  DROP TABLE "pages_blocks_citation_large" CASCADE;
  DROP TABLE "pages_blocks_stat_majeste" CASCADE;
  DROP TABLE "pages_blocks_chiffre_detail" CASCADE;
  DROP TABLE "pages_blocks_cartes_cartes" CASCADE;
  DROP TABLE "pages_blocks_cartes" CASCADE;
  DROP TABLE "pages_blocks_valeurs_valeurs" CASCADE;
  DROP TABLE "pages_blocks_valeurs" CASCADE;
  DROP TABLE "pages_blocks_formats_formats_points" CASCADE;
  DROP TABLE "pages_blocks_formats_formats" CASCADE;
  DROP TABLE "pages_blocks_formats" CASCADE;
  DROP TABLE "pages_blocks_etapes_etapes" CASCADE;
  DROP TABLE "pages_blocks_etapes" CASCADE;
  DROP TABLE "pages_blocks_faq_questions" CASCADE;
  DROP TABLE "pages_blocks_faq" CASCADE;
  DROP TABLE "pages_blocks_stats_stats" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_deux_colonnes" CASCADE;
  DROP TABLE "pages_blocks_texte_photo" CASCADE;
  DROP TABLE "pages_blocks_figure" CASCADE;
  DROP TABLE "pages_blocks_galerie_images" CASCADE;
  DROP TABLE "pages_blocks_galerie" CASCADE;
  DROP TABLE "pages_blocks_bandeau_image" CASCADE;
  DROP TABLE "pages_blocks_portraits_personnes" CASCADE;
  DROP TABLE "pages_blocks_portraits" CASCADE;
  DROP TABLE "pages_blocks_timeline_etapes" CASCADE;
  DROP TABLE "pages_blocks_timeline" CASCADE;
  DROP TABLE "pages_blocks_temoignages_ids" CASCADE;
  DROP TABLE "pages_blocks_temoignages" CASCADE;
  DROP TABLE "pages_blocks_equipe_ids" CASCADE;
  DROP TABLE "pages_blocks_equipe" CASCADE;
  DROP TABLE "pages_blocks_cta" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "actualites_tags" CASCADE;
  DROP TABLE "actualites" CASCADE;
  DROP TABLE "evenements" CASCADE;
  DROP TABLE "equipe" CASCADE;
  DROP TABLE "temoignages" CASCADE;
  DROP TABLE "partenaires" CASCADE;
  DROP TABLE "documents" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_prose_fond";
  DROP TYPE "public"."enum_pages_blocks_callout_fond";
  DROP TYPE "public"."enum_pages_blocks_callout_ton";
  DROP TYPE "public"."enum_pages_blocks_lettre_fond";
  DROP TYPE "public"."enum_pages_blocks_lettre_variant";
  DROP TYPE "public"."enum_pages_blocks_citation_fond";
  DROP TYPE "public"."enum_pages_blocks_citation_variant";
  DROP TYPE "public"."enum_pages_blocks_citation_large_fond";
  DROP TYPE "public"."enum_pages_blocks_citation_large_variant";
  DROP TYPE "public"."enum_pages_blocks_stat_majeste_fond";
  DROP TYPE "public"."enum_pages_blocks_stat_majeste_variant";
  DROP TYPE "public"."enum_pages_blocks_chiffre_detail_fond";
  DROP TYPE "public"."enum_pages_blocks_chiffre_detail_alignement";
  DROP TYPE "public"."enum_pages_blocks_chiffre_detail_couleur";
  DROP TYPE "public"."enum_pages_blocks_cartes_cartes_couleur";
  DROP TYPE "public"."enum_pages_blocks_cartes_fond";
  DROP TYPE "public"."enum_pages_blocks_cartes_colonnes";
  DROP TYPE "public"."enum_pages_blocks_valeurs_valeurs_couleur";
  DROP TYPE "public"."enum_pages_blocks_valeurs_fond";
  DROP TYPE "public"."enum_pages_blocks_formats_formats_couleur";
  DROP TYPE "public"."enum_pages_blocks_formats_fond";
  DROP TYPE "public"."enum_pages_blocks_formats_colonnes";
  DROP TYPE "public"."enum_pages_blocks_etapes_fond";
  DROP TYPE "public"."enum_pages_blocks_etapes_couleur";
  DROP TYPE "public"."enum_pages_blocks_faq_fond";
  DROP TYPE "public"."enum_pages_blocks_stats_fond";
  DROP TYPE "public"."enum_pages_blocks_deux_colonnes_fond";
  DROP TYPE "public"."enum_pages_blocks_deux_colonnes_picto_couleur";
  DROP TYPE "public"."enum_pages_blocks_texte_photo_fond";
  DROP TYPE "public"."enum_pages_blocks_texte_photo_position";
  DROP TYPE "public"."enum_pages_blocks_texte_photo_ratio";
  DROP TYPE "public"."enum_pages_blocks_figure_fond";
  DROP TYPE "public"."enum_pages_blocks_figure_taille";
  DROP TYPE "public"."enum_pages_blocks_galerie_fond";
  DROP TYPE "public"."enum_pages_blocks_galerie_colonnes";
  DROP TYPE "public"."enum_pages_blocks_bandeau_image_hauteur";
  DROP TYPE "public"."enum_pages_blocks_bandeau_image_position_texte";
  DROP TYPE "public"."enum_pages_blocks_bandeau_image_position_verticale";
  DROP TYPE "public"."enum_pages_blocks_portraits_fond";
  DROP TYPE "public"."enum_pages_blocks_portraits_colonnes";
  DROP TYPE "public"."enum_pages_blocks_portraits_forme";
  DROP TYPE "public"."enum_pages_blocks_timeline_fond";
  DROP TYPE "public"."enum_pages_blocks_timeline_alignement";
  DROP TYPE "public"."enum_pages_blocks_temoignages_fond";
  DROP TYPE "public"."enum_pages_blocks_temoignages_contexte";
  DROP TYPE "public"."enum_pages_blocks_equipe_fond";
  DROP TYPE "public"."enum_pages_blocks_equipe_forme";
  DROP TYPE "public"."enum_pages_blocks_equipe_colonnes";
  DROP TYPE "public"."enum_pages_blocks_cta_fond";
  DROP TYPE "public"."enum_pages_hero_variant";
  DROP TYPE "public"."enum_evenements_public";
  DROP TYPE "public"."enum_temoignages_contexte";
  DROP TYPE "public"."enum_partenaires_type";
  DROP TYPE "public"."enum_documents_categorie";
  DROP TYPE "public"."enum_site_banderole_urgence_couleur";`)
}

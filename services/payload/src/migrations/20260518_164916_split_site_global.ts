import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_banderole_urgence_couleur" AS ENUM('orange', 'violet', 'magenta');
  CREATE TABLE "identite" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom_asso" varchar DEFAULT '2mains de femmes' NOT NULL,
  	"url" varchar NOT NULL,
  	"accroche_globale" varchar NOT NULL,
  	"mission" varchar NOT NULL,
  	"directeur_publication" varchar NOT NULL,
  	"siren" varchar,
  	"rna" varchar,
  	"adresse" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "parametres" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"noindex" boolean DEFAULT false,
  	"gate_password" varchar,
  	"no_cache" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "liens_externes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"reseaux_facebook" varchar,
  	"reseaux_instagram" varchar,
  	"reseaux_linkedin" varchar,
  	"helloasso_don" varchar DEFAULT 'https://www.helloasso.com/associations/2mains-de-femmes',
  	"helloasso_adhesion" varchar,
  	"helloasso_newsletter" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "banderole_urgence" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"active" boolean DEFAULT false,
  	"message" varchar,
  	"couleur" "enum_banderole_urgence_couleur" DEFAULT 'orange',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );

  -- Migration manuelle des data : copie les rows de l'ancien global "site"
  -- vers les 4 nouveaux globals AVANT le DROP. Sinon Audrey perdrait
  -- toutes les valeurs renseignées (nom_asso, url, mission, adresse,
  -- réseaux, helloasso, banderole). Le couleur enum est castée via text
  -- car son nom a changé (enum_site_banderole_urgence_couleur → enum_banderole_urgence_couleur).
  INSERT INTO "identite" (id, nom_asso, url, accroche_globale, mission, directeur_publication, siren, rna, adresse, updated_at, created_at)
  SELECT id, nom_asso, url, accroche_globale, mission, directeur_publication, siren, rna, adresse, updated_at, created_at FROM "site";

  INSERT INTO "parametres" (id, noindex, gate_password, no_cache, updated_at, created_at)
  SELECT id, noindex, gate_password, no_cache, updated_at, created_at FROM "site";

  INSERT INTO "liens_externes" (id, reseaux_facebook, reseaux_instagram, reseaux_linkedin, helloasso_don, helloasso_adhesion, helloasso_newsletter, updated_at, created_at)
  SELECT id, reseaux_facebook, reseaux_instagram, reseaux_linkedin, helloasso_don, helloasso_adhesion, helloasso_newsletter, updated_at, created_at FROM "site";

  INSERT INTO "banderole_urgence" (id, active, message, couleur, updated_at, created_at)
  SELECT id, banderole_urgence_active, banderole_urgence_message, banderole_urgence_couleur::text::enum_banderole_urgence_couleur, updated_at, created_at FROM "site";

  -- Resync des sequences id pour que d'éventuels nouveaux INSERT ne
  -- foirent pas (les globals Payload restent à 1 row, mais safe).
  SELECT setval(pg_get_serial_sequence('"identite"', 'id'), COALESCE((SELECT MAX(id) FROM "identite"), 1));
  SELECT setval(pg_get_serial_sequence('"parametres"', 'id'), COALESCE((SELECT MAX(id) FROM "parametres"), 1));
  SELECT setval(pg_get_serial_sequence('"liens_externes"', 'id'), COALESCE((SELECT MAX(id) FROM "liens_externes"), 1));
  SELECT setval(pg_get_serial_sequence('"banderole_urgence"', 'id'), COALESCE((SELECT MAX(id) FROM "banderole_urgence"), 1));

  DROP TABLE "site" CASCADE;
  DROP TYPE "public"."enum_site_banderole_urgence_couleur";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_banderole_urgence_couleur" AS ENUM('orange', 'violet', 'magenta');
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"nom_asso" varchar DEFAULT '2mains de femmes' NOT NULL,
  	"url" varchar NOT NULL,
  	"noindex" boolean DEFAULT false,
  	"gate_password" varchar,
  	"no_cache" boolean DEFAULT false,
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
  
  DROP TABLE "identite" CASCADE;
  DROP TABLE "parametres" CASCADE;
  DROP TABLE "liens_externes" CASCADE;
  DROP TABLE "banderole_urgence" CASCADE;
  DROP TYPE "public"."enum_banderole_urgence_couleur";`)
}

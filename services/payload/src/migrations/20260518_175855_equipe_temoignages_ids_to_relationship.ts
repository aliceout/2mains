import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"temoignages_id" integer,
  	"equipe_id" integer
  );
  
  DROP TABLE "pages_blocks_temoignages_ids" CASCADE;
  DROP TABLE "pages_blocks_equipe_ids" CASCADE;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_temoignages_fk" FOREIGN KEY ("temoignages_id") REFERENCES "public"."temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_equipe_fk" FOREIGN KEY ("equipe_id") REFERENCES "public"."equipe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_order_idx" ON "pages_rels" USING btree ("order");
  CREATE INDEX "pages_rels_parent_idx" ON "pages_rels" USING btree ("parent_id");
  CREATE INDEX "pages_rels_path_idx" ON "pages_rels" USING btree ("path");
  CREATE INDEX "pages_rels_temoignages_id_idx" ON "pages_rels" USING btree ("temoignages_id");
  CREATE INDEX "pages_rels_equipe_id_idx" ON "pages_rels" USING btree ("equipe_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_temoignages_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  CREATE TABLE "pages_blocks_equipe_ids" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL
  );
  
  DROP TABLE "pages_rels" CASCADE;
  ALTER TABLE "pages_blocks_temoignages_ids" ADD CONSTRAINT "pages_blocks_temoignages_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_temoignages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_equipe_ids" ADD CONSTRAINT "pages_blocks_equipe_ids_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_equipe"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_temoignages_ids_order_idx" ON "pages_blocks_temoignages_ids" USING btree ("_order");
  CREATE INDEX "pages_blocks_temoignages_ids_parent_id_idx" ON "pages_blocks_temoignages_ids" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_equipe_ids_order_idx" ON "pages_blocks_equipe_ids" USING btree ("_order");
  CREATE INDEX "pages_blocks_equipe_ids_parent_id_idx" ON "pages_blocks_equipe_ids" USING btree ("_parent_id");`)
}

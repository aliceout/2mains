import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_navigation_header_nav_children_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_header_nav_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_header_buttons_link_type" AS ENUM('page', 'custom');
  CREATE TYPE "public"."enum_navigation_footer_columns_links_link_type" AS ENUM('page', 'custom');
  CREATE TABLE "navigation_header_nav_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"link_type" "enum_navigation_header_nav_children_link_type" DEFAULT 'custom',
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "navigation_header_nav" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"is_dropdown" boolean DEFAULT false,
  	"link_type" "enum_navigation_header_nav_link_type" DEFAULT 'custom',
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "navigation_header_buttons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_header_buttons_link_type" DEFAULT 'custom' NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar
  );
  
  CREATE TABLE "navigation_footer_columns_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"link_type" "enum_navigation_footer_columns_links_link_type" DEFAULT 'custom' NOT NULL,
  	"link_page_id" integer,
  	"link_url" varchar,
  	"highlight" boolean DEFAULT false
  );
  
  CREATE TABLE "navigation_footer_columns" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "navigation_header_nav_children" ADD CONSTRAINT "navigation_header_nav_children_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_nav_children" ADD CONSTRAINT "navigation_header_nav_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_header_nav"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_nav" ADD CONSTRAINT "navigation_header_nav_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_nav" ADD CONSTRAINT "navigation_header_nav_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_header_buttons" ADD CONSTRAINT "navigation_header_buttons_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_header_buttons" ADD CONSTRAINT "navigation_header_buttons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_link_page_id_pages_id_fk" FOREIGN KEY ("link_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns_links" ADD CONSTRAINT "navigation_footer_columns_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer_columns"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_columns" ADD CONSTRAINT "navigation_footer_columns_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_header_nav_children_order_idx" ON "navigation_header_nav_children" USING btree ("_order");
  CREATE INDEX "navigation_header_nav_children_parent_id_idx" ON "navigation_header_nav_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_nav_children_link_link_page_idx" ON "navigation_header_nav_children" USING btree ("link_page_id");
  CREATE INDEX "navigation_header_nav_order_idx" ON "navigation_header_nav" USING btree ("_order");
  CREATE INDEX "navigation_header_nav_parent_id_idx" ON "navigation_header_nav" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_nav_link_link_page_idx" ON "navigation_header_nav" USING btree ("link_page_id");
  CREATE INDEX "navigation_header_buttons_order_idx" ON "navigation_header_buttons" USING btree ("_order");
  CREATE INDEX "navigation_header_buttons_parent_id_idx" ON "navigation_header_buttons" USING btree ("_parent_id");
  CREATE INDEX "navigation_header_buttons_link_link_page_idx" ON "navigation_header_buttons" USING btree ("link_page_id");
  CREATE INDEX "navigation_footer_columns_links_order_idx" ON "navigation_footer_columns_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_links_parent_id_idx" ON "navigation_footer_columns_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_columns_links_link_link_page_idx" ON "navigation_footer_columns_links" USING btree ("link_page_id");
  CREATE INDEX "navigation_footer_columns_order_idx" ON "navigation_footer_columns" USING btree ("_order");
  CREATE INDEX "navigation_footer_columns_parent_id_idx" ON "navigation_footer_columns" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "navigation_header_nav_children" CASCADE;
  DROP TABLE "navigation_header_nav" CASCADE;
  DROP TABLE "navigation_header_buttons" CASCADE;
  DROP TABLE "navigation_footer_columns_links" CASCADE;
  DROP TABLE "navigation_footer_columns" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TYPE "public"."enum_navigation_header_nav_children_link_type";
  DROP TYPE "public"."enum_navigation_header_nav_link_type";
  DROP TYPE "public"."enum_navigation_header_buttons_link_type";
  DROP TYPE "public"."enum_navigation_footer_columns_links_link_type";`)
}

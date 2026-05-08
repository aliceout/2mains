import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_two_factor_backup_code_hashes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_sessions" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_two_factor_backup_code_hashes" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  ALTER TABLE "site" ALTER COLUMN "url" DROP DEFAULT;
  ALTER TABLE "users" DROP COLUMN "two_factor_method";
  ALTER TABLE "users" DROP COLUMN "two_factor_totp_secret";
  ALTER TABLE "users" DROP COLUMN "two_factor_totp_enrolled_at";
  ALTER TABLE "users" DROP COLUMN "two_factor_backup_codes_generated_at";
  DROP TYPE "public"."enum_users_two_factor_method";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_two_factor_method" AS ENUM('email', 'totp');
  CREATE TABLE "users_two_factor_backup_code_hashes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hash" varchar NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "site" ALTER COLUMN "url" SET DEFAULT 'https://2mainsdefemmes.org';
  ALTER TABLE "users" ADD COLUMN "two_factor_method" "enum_users_two_factor_method" DEFAULT 'email' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "two_factor_totp_secret" varchar;
  ALTER TABLE "users" ADD COLUMN "two_factor_totp_enrolled_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "two_factor_backup_codes_generated_at" timestamp(3) with time zone;
  ALTER TABLE "users_two_factor_backup_code_hashes" ADD CONSTRAINT "users_two_factor_backup_code_hashes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_two_factor_backup_code_hashes_order_idx" ON "users_two_factor_backup_code_hashes" USING btree ("_order");
  CREATE INDEX "users_two_factor_backup_code_hashes_parent_id_idx" ON "users_two_factor_backup_code_hashes" USING btree ("_parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");`)
}

import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('root', 'admin', 'editor');
  CREATE TYPE "public"."enum_users_status" AS ENUM('pending', 'active', 'disabled');
  CREATE TYPE "public"."enum_users_two_factor_method" AS ENUM('email', 'totp');
  CREATE TABLE "users_two_factor_backup_code_hashes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"hash" varchar NOT NULL
  );
  
  CREATE TABLE "users_trusted_devices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"device_id" varchar NOT NULL,
  	"fingerprint_hash" varchar NOT NULL,
  	"label" varchar,
  	"user_agent" varchar,
  	"ip" varchar,
  	"created_at" timestamp(3) with time zone NOT NULL,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  ALTER TABLE "users" ADD COLUMN "display_name" varchar;
  ALTER TABLE "users" ADD COLUMN "role" "enum_users_role" DEFAULT 'editor' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "status" "enum_users_status" DEFAULT 'active' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "invitation_token_hash" varchar;
  ALTER TABLE "users" ADD COLUMN "invitation_expires_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "invitation_invited_by_id" integer;
  ALTER TABLE "users" ADD COLUMN "invitation_invited_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "two_factor_method" "enum_users_two_factor_method" DEFAULT 'email' NOT NULL;
  ALTER TABLE "users" ADD COLUMN "two_factor_totp_secret" varchar;
  ALTER TABLE "users" ADD COLUMN "two_factor_totp_enrolled_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "two_factor_email_code_hash" varchar;
  ALTER TABLE "users" ADD COLUMN "two_factor_email_code_expires_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "two_factor_email_code_attempts" numeric DEFAULT 0;
  ALTER TABLE "users" ADD COLUMN "two_factor_backup_codes_generated_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "last_activity_at" timestamp(3) with time zone;
  ALTER TABLE "users" ADD COLUMN "last_login_at" timestamp(3) with time zone;
  ALTER TABLE "users_two_factor_backup_code_hashes" ADD CONSTRAINT "users_two_factor_backup_code_hashes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_trusted_devices" ADD CONSTRAINT "users_trusted_devices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_two_factor_backup_code_hashes_order_idx" ON "users_two_factor_backup_code_hashes" USING btree ("_order");
  CREATE INDEX "users_two_factor_backup_code_hashes_parent_id_idx" ON "users_two_factor_backup_code_hashes" USING btree ("_parent_id");
  CREATE INDEX "users_trusted_devices_order_idx" ON "users_trusted_devices" USING btree ("_order");
  CREATE INDEX "users_trusted_devices_parent_id_idx" ON "users_trusted_devices" USING btree ("_parent_id");
  ALTER TABLE "users" ADD CONSTRAINT "users_invitation_invited_by_id_users_id_fk" FOREIGN KEY ("invitation_invited_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_invitation_invitation_token_hash_idx" ON "users" USING btree ("invitation_token_hash");
  CREATE INDEX "users_invitation_invitation_invited_by_idx" ON "users" USING btree ("invitation_invited_by_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "users_two_factor_backup_code_hashes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "users_trusted_devices" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "users_two_factor_backup_code_hashes" CASCADE;
  DROP TABLE "users_trusted_devices" CASCADE;
  ALTER TABLE "users" DROP CONSTRAINT "users_invitation_invited_by_id_users_id_fk";
  
  DROP INDEX "users_invitation_invitation_token_hash_idx";
  DROP INDEX "users_invitation_invitation_invited_by_idx";
  ALTER TABLE "users" DROP COLUMN "display_name";
  ALTER TABLE "users" DROP COLUMN "role";
  ALTER TABLE "users" DROP COLUMN "status";
  ALTER TABLE "users" DROP COLUMN "invitation_token_hash";
  ALTER TABLE "users" DROP COLUMN "invitation_expires_at";
  ALTER TABLE "users" DROP COLUMN "invitation_invited_by_id";
  ALTER TABLE "users" DROP COLUMN "invitation_invited_at";
  ALTER TABLE "users" DROP COLUMN "two_factor_method";
  ALTER TABLE "users" DROP COLUMN "two_factor_totp_secret";
  ALTER TABLE "users" DROP COLUMN "two_factor_totp_enrolled_at";
  ALTER TABLE "users" DROP COLUMN "two_factor_email_code_hash";
  ALTER TABLE "users" DROP COLUMN "two_factor_email_code_expires_at";
  ALTER TABLE "users" DROP COLUMN "two_factor_email_code_attempts";
  ALTER TABLE "users" DROP COLUMN "two_factor_backup_codes_generated_at";
  ALTER TABLE "users" DROP COLUMN "last_activity_at";
  ALTER TABLE "users" DROP COLUMN "last_login_at";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_users_two_factor_method";`)
}

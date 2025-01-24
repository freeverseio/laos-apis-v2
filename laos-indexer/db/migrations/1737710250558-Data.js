module.exports = class Data1737710250558 {
    name = 'Data1737710250558'

    async up(db) {
        await db.query(`CREATE TABLE "laos_asset" ("id" character varying NOT NULL, "laos_contract" text NOT NULL, "token_id" numeric NOT NULL, "initial_owner" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "log_index" integer NOT NULL, "metadata" text, CONSTRAINT "PK_b922ae1a317644c470a64c7174f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ff8a3b3470ab42f6d7d20f9d84" ON "laos_asset" ("laos_contract") `)
        await db.query(`CREATE INDEX "IDX_e4e4978a0c9d154a00e1ad3830" ON "laos_asset" ("metadata") `)
        await db.query(`CREATE TABLE "token_uri" ("id" character varying NOT NULL, "state" text NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "fetched" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_1f5797cb07d9a79407a00292363" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "metadata" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "laos_asset_id" character varying, "token_uri_id" character varying, CONSTRAINT "PK_56b22355e89941b9792c04ab176" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_90484e3241344e9b970c82ea67" ON "metadata" ("laos_asset_id") `)
        await db.query(`CREATE INDEX "IDX_d14ff181d0e754aba6f171d59b" ON "metadata" ("token_uri_id") `)
        await db.query(`CREATE INDEX "IDX_78be4c41c64f3ec6913882574b" ON "metadata" ("tx_hash") `)
        await db.query(`ALTER TABLE "metadata" ADD CONSTRAINT "FK_90484e3241344e9b970c82ea67d" FOREIGN KEY ("laos_asset_id") REFERENCES "laos_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "metadata" ADD CONSTRAINT "FK_d14ff181d0e754aba6f171d59bc" FOREIGN KEY ("token_uri_id") REFERENCES "token_uri"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "laos_asset"`)
        await db.query(`DROP INDEX "public"."IDX_ff8a3b3470ab42f6d7d20f9d84"`)
        await db.query(`DROP INDEX "public"."IDX_e4e4978a0c9d154a00e1ad3830"`)
        await db.query(`DROP TABLE "token_uri"`)
        await db.query(`DROP TABLE "metadata"`)
        await db.query(`DROP INDEX "public"."IDX_90484e3241344e9b970c82ea67"`)
        await db.query(`DROP INDEX "public"."IDX_d14ff181d0e754aba6f171d59b"`)
        await db.query(`DROP INDEX "public"."IDX_78be4c41c64f3ec6913882574b"`)
        await db.query(`ALTER TABLE "metadata" DROP CONSTRAINT "FK_90484e3241344e9b970c82ea67d"`)
        await db.query(`ALTER TABLE "metadata" DROP CONSTRAINT "FK_d14ff181d0e754aba6f171d59bc"`)
    }
}

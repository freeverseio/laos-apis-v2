module.exports = class Data1738832075837 {
    name = 'Data1738832075837'

    async up(db) {
        await db.query(`CREATE TABLE "sigma_laos_asset" ("id" character varying NOT NULL, "laos_contract" text NOT NULL, "token_id" numeric NOT NULL, "initial_owner" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "log_index" integer NOT NULL, "metadata" text, CONSTRAINT "PK_f4d10c2d51924d774f377a834ad" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2a96120efcbfa413ffa587a430" ON "sigma_laos_asset" ("laos_contract") `)
        await db.query(`CREATE INDEX "IDX_59278ca2c0d0b4d5942563d347" ON "sigma_laos_asset" ("metadata") `)
        await db.query(`CREATE TABLE "sigma_token_uri" ("id" character varying NOT NULL, "state" text NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "fetched" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_d2ec5fe1188d4612598a03dadb3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "sigma_metadata" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "laos_asset_id" character varying, "token_uri_id" character varying, CONSTRAINT "PK_3f0505ebeea72010aea1f64cb3c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d58a39908ed3b6275ab29f025d" ON "sigma_metadata" ("laos_asset_id") `)
        await db.query(`CREATE INDEX "IDX_8596ef20d6cd5c797a8230a6d6" ON "sigma_metadata" ("token_uri_id") `)
        await db.query(`CREATE INDEX "IDX_c7016ae20df62cf3a942895330" ON "sigma_metadata" ("tx_hash") `)
        await db.query(`ALTER TABLE "sigma_metadata" ADD CONSTRAINT "FK_d58a39908ed3b6275ab29f025de" FOREIGN KEY ("laos_asset_id") REFERENCES "sigma_laos_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "sigma_metadata" ADD CONSTRAINT "FK_8596ef20d6cd5c797a8230a6d63" FOREIGN KEY ("token_uri_id") REFERENCES "sigma_token_uri"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "sigma_laos_asset"`)
        await db.query(`DROP INDEX "public"."IDX_2a96120efcbfa413ffa587a430"`)
        await db.query(`DROP INDEX "public"."IDX_59278ca2c0d0b4d5942563d347"`)
        await db.query(`DROP TABLE "sigma_token_uri"`)
        await db.query(`DROP TABLE "sigma_metadata"`)
        await db.query(`DROP INDEX "public"."IDX_d58a39908ed3b6275ab29f025d"`)
        await db.query(`DROP INDEX "public"."IDX_8596ef20d6cd5c797a8230a6d6"`)
        await db.query(`DROP INDEX "public"."IDX_c7016ae20df62cf3a942895330"`)
        await db.query(`ALTER TABLE "sigma_metadata" DROP CONSTRAINT "FK_d58a39908ed3b6275ab29f025de"`)
        await db.query(`ALTER TABLE "sigma_metadata" DROP CONSTRAINT "FK_8596ef20d6cd5c797a8230a6d63"`)
    }
}

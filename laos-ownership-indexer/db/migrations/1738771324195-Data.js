module.exports = class Data1738771324195 {
    name = 'Data1738771324195'

    async up(db) {
        await db.query(`CREATE TABLE "mainnet_laos_asset" ("id" character varying NOT NULL, "laos_contract" text NOT NULL, "token_id" numeric NOT NULL, "initial_owner" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, "log_index" integer NOT NULL, "metadata" text, CONSTRAINT "PK_e8c42d81658fafac7af4ee7bdc6" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_58477c608107b3a22e6d4cd5fa" ON "mainnet_laos_asset" ("laos_contract") `)
        await db.query(`CREATE INDEX "IDX_772f307f49a91fb0ed426ba11d" ON "mainnet_laos_asset" ("metadata") `)
        await db.query(`CREATE TABLE "mainnet_token_uri" ("id" character varying NOT NULL, "state" text NOT NULL, "name" text, "description" text, "image" text, "attributes" jsonb, "fetched" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6c38f21b3eab1889d3f35d7a8c9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "mainnet_metadata" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "tx_hash" text NOT NULL, "laos_asset_id" character varying, "token_uri_id" character varying, CONSTRAINT "PK_b7a7a0a39387bffc0dfa5303e97" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_69cbc6bf4734613b17a5d3856f" ON "mainnet_metadata" ("laos_asset_id") `)
        await db.query(`CREATE INDEX "IDX_02f3eb99d0417b43197be96bfe" ON "mainnet_metadata" ("token_uri_id") `)
        await db.query(`CREATE INDEX "IDX_793066f8a8da284ddd8d95c4ab" ON "mainnet_metadata" ("tx_hash") `)
        await db.query(`ALTER TABLE "mainnet_metadata" ADD CONSTRAINT "FK_69cbc6bf4734613b17a5d3856fe" FOREIGN KEY ("laos_asset_id") REFERENCES "mainnet_laos_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "mainnet_metadata" ADD CONSTRAINT "FK_02f3eb99d0417b43197be96bfe5" FOREIGN KEY ("token_uri_id") REFERENCES "mainnet_token_uri"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "mainnet_laos_asset"`)
        await db.query(`DROP INDEX "public"."IDX_58477c608107b3a22e6d4cd5fa"`)
        await db.query(`DROP INDEX "public"."IDX_772f307f49a91fb0ed426ba11d"`)
        await db.query(`DROP TABLE "mainnet_token_uri"`)
        await db.query(`DROP TABLE "mainnet_metadata"`)
        await db.query(`DROP INDEX "public"."IDX_69cbc6bf4734613b17a5d3856f"`)
        await db.query(`DROP INDEX "public"."IDX_02f3eb99d0417b43197be96bfe"`)
        await db.query(`DROP INDEX "public"."IDX_793066f8a8da284ddd8d95c4ab"`)
        await db.query(`ALTER TABLE "mainnet_metadata" DROP CONSTRAINT "FK_69cbc6bf4734613b17a5d3856fe"`)
        await db.query(`ALTER TABLE "mainnet_metadata" DROP CONSTRAINT "FK_02f3eb99d0417b43197be96bfe5"`)
    }
}

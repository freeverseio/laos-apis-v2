module.exports = class Data1738928413533 {
    name = 'Data1738928413533'

    async up(db) {
        await db.query(`CREATE TABLE "polygon_transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "asset_id" character varying, CONSTRAINT "PK_4e5638dcaf2d7479c8645657526" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d4d998dfafa1292c062e40cc13" ON "polygon_transfer" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_faf9f0db66732a8b67418c9b93" ON "polygon_transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "polygon_asset" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "owner" text NOT NULL, "ownership_contract_id" character varying, CONSTRAINT "PK_95aa8f2b794de6d6c14026315b8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_1532b946e33c6e82a73ba8a1b6" ON "polygon_asset" ("ownership_contract_id") `)
        await db.query(`CREATE TABLE "polygon_ownership_contract" ("id" character varying NOT NULL, "address" text, "laos_contract" text, "base_uri" text, "laos_chain_id" integer, "name" text, "symbol" text, "bytecode_hash" text, CONSTRAINT "PK_89d5626d86e841b70ef7c1784d2" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_c781c9ba72d6cff38c7ee59b64" ON "polygon_ownership_contract" ("address") `)
        await db.query(`CREATE INDEX "IDX_6a9b48f6dcb0245043d293dd07" ON "polygon_ownership_contract" ("laos_contract") `)
        await db.query(`ALTER TABLE "polygon_transfer" ADD CONSTRAINT "FK_d4d998dfafa1292c062e40cc139" FOREIGN KEY ("asset_id") REFERENCES "polygon_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "polygon_asset" ADD CONSTRAINT "FK_1532b946e33c6e82a73ba8a1b65" FOREIGN KEY ("ownership_contract_id") REFERENCES "polygon_ownership_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "polygon_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_d4d998dfafa1292c062e40cc13"`)
        await db.query(`DROP INDEX "public"."IDX_faf9f0db66732a8b67418c9b93"`)
        await db.query(`DROP TABLE "polygon_asset"`)
        await db.query(`DROP INDEX "public"."IDX_1532b946e33c6e82a73ba8a1b6"`)
        await db.query(`DROP TABLE "polygon_ownership_contract"`)
        await db.query(`DROP INDEX "public"."IDX_c781c9ba72d6cff38c7ee59b64"`)
        await db.query(`DROP INDEX "public"."IDX_6a9b48f6dcb0245043d293dd07"`)
        await db.query(`ALTER TABLE "polygon_transfer" DROP CONSTRAINT "FK_d4d998dfafa1292c062e40cc139"`)
        await db.query(`ALTER TABLE "polygon_asset" DROP CONSTRAINT "FK_1532b946e33c6e82a73ba8a1b65"`)
    }
}

module.exports = class Data1740131009734 {
    name = 'Data1740131009734'

    async up(db) {
        await db.query(`CREATE TABLE "hedera_transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "asset_id" character varying, CONSTRAINT "PK_fcb92a41922bfc6adc3f6d314c8" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_2163238587940bbac1ad9f5627" ON "hedera_transfer" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_99e45c71be1f8cfc43441bde5d" ON "hedera_transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "hedera_asset" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "owner" text NOT NULL, "ownership_contract_id" character varying, CONSTRAINT "PK_1c02d015bf23fecaf89577818b4" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_26f8c20a38547cb243e7968ad5" ON "hedera_asset" ("ownership_contract_id") `)
        await db.query(`CREATE TABLE "hedera_ownership_contract" ("id" character varying NOT NULL, "address" text, "laos_contract" text, "base_uri" text, "laos_chain_id" integer, "name" text, "symbol" text, "bytecode_hash" text, CONSTRAINT "PK_cd4ce838fa64e586727a8c71f9e" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ccdba46fdcf8fc1e29808f95bd" ON "hedera_ownership_contract" ("address") `)
        await db.query(`CREATE INDEX "IDX_bd78c7c535bb17cdd338ad0eb3" ON "hedera_ownership_contract" ("laos_contract") `)
        await db.query(`ALTER TABLE "hedera_transfer" ADD CONSTRAINT "FK_2163238587940bbac1ad9f56270" FOREIGN KEY ("asset_id") REFERENCES "hedera_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "hedera_asset" ADD CONSTRAINT "FK_26f8c20a38547cb243e7968ad5c" FOREIGN KEY ("ownership_contract_id") REFERENCES "hedera_ownership_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "hedera_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_2163238587940bbac1ad9f5627"`)
        await db.query(`DROP INDEX "public"."IDX_99e45c71be1f8cfc43441bde5d"`)
        await db.query(`DROP TABLE "hedera_asset"`)
        await db.query(`DROP INDEX "public"."IDX_26f8c20a38547cb243e7968ad5"`)
        await db.query(`DROP TABLE "hedera_ownership_contract"`)
        await db.query(`DROP INDEX "public"."IDX_ccdba46fdcf8fc1e29808f95bd"`)
        await db.query(`DROP INDEX "public"."IDX_bd78c7c535bb17cdd338ad0eb3"`)
        await db.query(`ALTER TABLE "hedera_transfer" DROP CONSTRAINT "FK_2163238587940bbac1ad9f56270"`)
        await db.query(`ALTER TABLE "hedera_asset" DROP CONSTRAINT "FK_26f8c20a38547cb243e7968ad5c"`)
    }
}

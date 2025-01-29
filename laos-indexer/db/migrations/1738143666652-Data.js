module.exports = class Data1738143666652 {
    name = 'Data1738143666652'

    async up(db) {
        await db.query(`CREATE TABLE "ethereum_transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "asset_id" character varying, CONSTRAINT "PK_ac6a01c394790cf3b47f432fa4a" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d046e8118e244611792b1bd6a7" ON "ethereum_transfer" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_fbd87755d41c088be65eb6c162" ON "ethereum_transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "ethereum_asset" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "owner" text NOT NULL, "ownership_contract_id" character varying, CONSTRAINT "PK_0e9341a8b918bd7fdb4b1264547" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f83bab95c9e9daba31795fbe51" ON "ethereum_asset" ("ownership_contract_id") `)
        await db.query(`CREATE TABLE "ethereum_ownership_contract" ("id" character varying NOT NULL, "address" text, "laos_contract" text, "name" text, "symbol" text, "bytecode_hash" text, CONSTRAINT "PK_b0ecc1721af1dd4e5e900ddf54d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7db5a8e4827226caaf7653f221" ON "ethereum_ownership_contract" ("address") `)
        await db.query(`CREATE INDEX "IDX_e3cf3f7e5e25508b3847039ca4" ON "ethereum_ownership_contract" ("laos_contract") `)
        await db.query(`ALTER TABLE "ethereum_transfer" ADD CONSTRAINT "FK_d046e8118e244611792b1bd6a70" FOREIGN KEY ("asset_id") REFERENCES "ethereum_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "ethereum_asset" ADD CONSTRAINT "FK_f83bab95c9e9daba31795fbe517" FOREIGN KEY ("ownership_contract_id") REFERENCES "ethereum_ownership_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "ethereum_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_d046e8118e244611792b1bd6a7"`)
        await db.query(`DROP INDEX "public"."IDX_fbd87755d41c088be65eb6c162"`)
        await db.query(`DROP TABLE "ethereum_asset"`)
        await db.query(`DROP INDEX "public"."IDX_f83bab95c9e9daba31795fbe51"`)
        await db.query(`DROP TABLE "ethereum_ownership_contract"`)
        await db.query(`DROP INDEX "public"."IDX_7db5a8e4827226caaf7653f221"`)
        await db.query(`DROP INDEX "public"."IDX_e3cf3f7e5e25508b3847039ca4"`)
        await db.query(`ALTER TABLE "ethereum_transfer" DROP CONSTRAINT "FK_d046e8118e244611792b1bd6a70"`)
        await db.query(`ALTER TABLE "ethereum_asset" DROP CONSTRAINT "FK_f83bab95c9e9daba31795fbe517"`)
    }
}

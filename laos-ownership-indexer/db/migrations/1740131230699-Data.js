module.exports = class Data1740131230699 {
    name = 'Data1740131230699'

    async up(db) {
        await db.query(`CREATE TABLE "hederatestnet_transfer" ("id" character varying NOT NULL, "from" text NOT NULL, "to" text NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, "tx_hash" text NOT NULL, "asset_id" character varying, CONSTRAINT "PK_7cb24a3bd73cf45dd3db1846ccd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_f25ba1590f408118acebdcb361" ON "hederatestnet_transfer" ("asset_id") `)
        await db.query(`CREATE INDEX "IDX_dc31fac3d8eea64ee04759f99f" ON "hederatestnet_transfer" ("tx_hash") `)
        await db.query(`CREATE TABLE "hederatestnet_asset" ("id" character varying NOT NULL, "token_id" numeric NOT NULL, "owner" text NOT NULL, "ownership_contract_id" character varying, CONSTRAINT "PK_387aae279d147f4638d1865d038" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e54cb5774d7ba28bde20c8f64d" ON "hederatestnet_asset" ("ownership_contract_id") `)
        await db.query(`CREATE TABLE "hederatestnet_ownership_contract" ("id" character varying NOT NULL, "address" text, "laos_contract" text, "base_uri" text, "laos_chain_id" integer, "name" text, "symbol" text, "bytecode_hash" text, CONSTRAINT "PK_2d33d69730c047470685c08f264" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4b1bfe78bcb0319f63a7db89db" ON "hederatestnet_ownership_contract" ("address") `)
        await db.query(`CREATE INDEX "IDX_1b7834a47502806aef66c0e624" ON "hederatestnet_ownership_contract" ("laos_contract") `)
        await db.query(`ALTER TABLE "hederatestnet_transfer" ADD CONSTRAINT "FK_f25ba1590f408118acebdcb3612" FOREIGN KEY ("asset_id") REFERENCES "hederatestnet_asset"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "hederatestnet_asset" ADD CONSTRAINT "FK_e54cb5774d7ba28bde20c8f64da" FOREIGN KEY ("ownership_contract_id") REFERENCES "hederatestnet_ownership_contract"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "hederatestnet_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_f25ba1590f408118acebdcb361"`)
        await db.query(`DROP INDEX "public"."IDX_dc31fac3d8eea64ee04759f99f"`)
        await db.query(`DROP TABLE "hederatestnet_asset"`)
        await db.query(`DROP INDEX "public"."IDX_e54cb5774d7ba28bde20c8f64d"`)
        await db.query(`DROP TABLE "hederatestnet_ownership_contract"`)
        await db.query(`DROP INDEX "public"."IDX_4b1bfe78bcb0319f63a7db89db"`)
        await db.query(`DROP INDEX "public"."IDX_1b7834a47502806aef66c0e624"`)
        await db.query(`ALTER TABLE "hederatestnet_transfer" DROP CONSTRAINT "FK_f25ba1590f408118acebdcb3612"`)
        await db.query(`ALTER TABLE "hederatestnet_asset" DROP CONSTRAINT "FK_e54cb5774d7ba28bde20c8f64da"`)
    }
}

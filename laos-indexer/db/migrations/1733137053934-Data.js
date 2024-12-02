module.exports = class Data1733137053934 {
    name = 'Data1733137053934'

    async up(db) {
        await db.query(`ALTER TABLE "ownership_contract" ADD COLUMN "name" text`)
        await db.query(`ALTER TABLE "ownership_contract" ADD COLUMN "symbol" text`)
        await db.query(`ALTER TABLE "ownership_contract" ADD COLUMN "bytecode_hash" text`)
    }

    async down(db) {        
    }
}
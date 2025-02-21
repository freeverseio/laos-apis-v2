const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 23798, 
    username: "postgres",
    password: "postgres",
    database: "squid",
    synchronize: false, // Must be false for migrations
    migrations: ["db/migrations/*.js"],
    logging: true
});

module.exports = { AppDataSource };

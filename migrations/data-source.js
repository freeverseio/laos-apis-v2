const { DataSource } = require("typeorm");

const AppDataSource = new DataSource({
    type: "postgres", // Change to "mysql", "sqlite", etc., if needed
    host: "localhost",
    port: 23798, // Adjust according to your database
    username: "postgres",
    password: "postgres",
    database: "squid",
    synchronize: false, // Must be false for migrations
    migrations: ["db/migrations/*.js"], // Ensure this path is correct
    logging: true
});

// Export the data source to use in scripts
module.exports = { AppDataSource };

const { AppDataSource } = require("./data-source");
const dotenv = require("dotenv");

dotenv.config();

AppDataSource.initialize()
  .then(async () => {
    console.log("Running migrations...");
    await AppDataSource.runMigrations();
    console.log("Migrations executed successfully!");
    process.exit();
  })
  .catch((error) => {
    console.error("Error running migrations:", error);
    process.exit(1);
  });

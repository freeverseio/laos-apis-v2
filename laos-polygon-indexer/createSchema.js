const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

function generateSchema() {
  // Ensure the chainName environment variable is set
  const chainName = process.env.CHAIN_NAME;
  if (!chainName) {
    console.error("Environment variable CHAIN_NAME is not set.");
    process.exit(1);
  }

  // Define file paths
  const templatePath = path.resolve(__dirname, "schema.graphql.template");
  const outputPath = path.resolve(__dirname, "schema.graphql");

  // Check if the template file exists
  if (!fs.existsSync(templatePath)) {
    console.error(`Template file not found at ${templatePath}`);
    process.exit(1);
  }

  try {
    // Read the template file
    const templateContent = fs.readFileSync(templatePath, "utf-8");

    // Replace placeholders with the chainName
    const replacedContent = templateContent.replace(/\${chainName}/g, chainName);

    // Write the modified content to the output file
    fs.writeFileSync(outputPath, replacedContent, "utf-8");
    console.log(`Schema successfully generated at ${outputPath}`);
  } catch (error) {
    console.error("An error occurred:", error.message);
    process.exit(1);
  }
}

// Run the function
generateSchema();

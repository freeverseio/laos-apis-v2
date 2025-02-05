const fs = require("fs/promises");
const path = require("path");
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

/**
 * Generate schema file by replacing placeholders in the template.
 * @param {string} chainName - The chain name to replace placeholders with.
 * @param {string} templatePath - Path to the template file.
 * @param {string} outputPath - Path to save the generated schema file.
 */
async function generateSchemaFile(chainName, templatePath, outputPath) {
  try {
    // Read the template file
    const templateContent = await fs.readFile(templatePath, "utf-8");

    // Replace placeholders
    const replacedContent = templateContent.replace(/\$\{chainName\}/g, chainName);

    // Write the replaced content to the output file
    await fs.writeFile(outputPath, replacedContent, "utf-8");

    console.log(`✅ Schema successfully generated at ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

/**
 * Main function to handle CLI args, environment variables, and file generation.
 */
async function main() {
  const args = process.argv.slice(2);
  const chainNameArg = args.find(arg => arg.startsWith("--chainName="));
  const chainName = chainNameArg ? chainNameArg.split("=")[1] : process.env.CHAIN_NAME;

  if (!chainName) {
    console.error("❌ Missing chain name. Provide it via --chainName or the CHAIN_NAME environment variable.");
    process.exit(1);
  }

  // Define file paths
  const templatePath = path.resolve(__dirname, "schema.graphql.template");
  const outputPath = path.resolve(__dirname, "schema.graphql");

  try {
    // Check if template file exists
    await fs.access(templatePath);
  } catch {
    console.error(`❌ Template file not found at ${templatePath}`);
    process.exit(1);
  }

  // Generate schema file
  await generateSchemaFile(chainName, templatePath, outputPath);
}

main();

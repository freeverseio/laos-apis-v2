import fs from 'fs';
import path from 'path';

const rootDir = process.env.ROOT_DIR as string;
const apiKeysFilePath = path.join(rootDir, 'config', 'apiKeys.json');

export default async function validateApiKey(apiKey: string, contractAddress: string): Promise<boolean> {
  try {
    const apiKeysData = JSON.parse(fs.readFileSync(apiKeysFilePath, 'utf-8'));

    // Find the entry with the matching apiKey
    const apiKeyEntry = apiKeysData.apiKeys.find((entry: { apiKey: string; contracts: { contractAddress: string; batchMinterContract: string }[] }) => entry.apiKey === apiKey);

    if (!apiKeyEntry) {
      console.error('API key not found');
      return false;
    }

    // Check if the contractAddress is in the list of contracts for this apiKey
    const hasContract = apiKeyEntry.contracts.some((contract: { contractAddress: string; batchMinterContract: string }) => contract.contractAddress === contractAddress);

    if (!hasContract) {
      console.error('Contract address not authorized for this API key');
      return false;
    }

    // Both the API key and contract address are valid
    return true;
  } catch (error) {
    console.error('Error reading API keys file:', error);
    return false;
  }
}

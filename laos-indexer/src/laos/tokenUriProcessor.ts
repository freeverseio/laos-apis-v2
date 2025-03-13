import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { readdirSync } from 'fs';
import { join } from 'path';
import { TokenURIDataService } from './service/TokenURIDataService';
dotenv.config();

async function loadEntities(): Promise<any[]> {
  const entitiesPath = join(__dirname, '../model/generated');
  const entityFiles = readdirSync(entitiesPath).filter(file => file.endsWith('.ts') || file.endsWith('.js'));

  const entities = await Promise.all(
    entityFiles.map(async (file) => {
      const module = await import(join(entitiesPath, file));
      return Object.values(module)[0];
    })
  );

  return entities;
}

export async function initializeDataSource() {
  const entities = await loadEntities();

  const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    ssl: process.env.DB_SSL_CA_FILE
      ? {
          rejectUnauthorized: false,
          ca: process.env.DB_SSL_CA_FILE,
        }
      : false,
    entities,
  });

  if (!AppDataSource.isInitialized) {
    await AppDataSource.initialize();
  }
  return AppDataSource;
}

export async function processTokenURIs() {
  try {
    const AppDataSource = await initializeDataSource();
    console.log('DB Initialized:', AppDataSource.isInitialized);
    
    const entityManager = AppDataSource.manager;
    const tokenURIDataService = TokenURIDataService.getInstance(entityManager);
    await tokenURIDataService.updatePendingTokenUris();
  } catch (error) {
    console.error('Error processing token URIs:', formatError(error as Error));
  }
}

function formatError(error: Error): string {
  // limit length of error message to 200 characters
  const errorMessage = error.message.length > 200 ? error.message.substring(0, 200) : error.message;
  const stack = error.stack?.length ? error.stack.substring(0, 200) : error.stack;
  return `
    Error: ${errorMessage}
    Stack: ${stack}
  `;
}
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { TokenURIDataService } from './service/TokenURIDataService';
import * as dotenv from 'dotenv';
import { TokenUri, MainnetMetadata as Metadata, MainnetLaosAsset as LaosAsset } from '../model';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  ssl:  process.env.DB_SSL_CA_FILE!=undefined
    ? {
      rejectUnauthorized: false,
      ca: process.env.DB_SSL_CA_FILE,
    }
    : false, 
  entities: [TokenUri, Metadata, LaosAsset], 
});

export async function processTokenURIs() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }
    console.log('process.env.DB_SSL_CA_FILE', AppDataSource.isInitialized);
    const entityManager = AppDataSource.manager;
    const tokenURIDataService = TokenURIDataService.getInstance(entityManager);
    await tokenURIDataService.updatePendingTokenUris();
  } catch (error) {
    console.error('Error processing token URIs:', error);
  }
}




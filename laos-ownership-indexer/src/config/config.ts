import fs from 'fs/promises';
import { LaosChain } from '../model';

class Config {
  private static instance: Config;
  private supportedLaosChains: LaosChain[] | null = null;

  private constructor() {}

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public async loadConfig(): Promise<void> {
    if (!this.supportedLaosChains || this.supportedLaosChains.length === 0) {
      try {
        const data = await fs.readFile('laos-consensus/laos-consensus.json', 'utf8');
        this.supportedLaosChains = (JSON.parse(data) as any).chains;
      } catch (error) {
        console.error('Error reading supported chains:', error);
        throw error;
      }
    }
  }

  public async getSupportedLaosChains(): Promise<LaosChain[]> {
    if (!this.supportedLaosChains) {
      await this.loadConfig();
    }
    return this.supportedLaosChains ?? [];
  }
}

export default Config.getInstance();
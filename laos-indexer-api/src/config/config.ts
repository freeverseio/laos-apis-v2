import fs from 'fs/promises';

class Config {
  private static instance: Config;
  private supportedChains: any = null;
  private supportedLaosChains: any = null;

  private constructor() {}

  public static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  public async loadConfig(): Promise<void> {
    if (!this.supportedChains) {
      try {
        const data = await fs.readFile('supported-chains/supported-chains.json', 'utf8');
        this.supportedChains = JSON.parse(data);
      } catch (error) {
        console.error('Error reading supported chains:', error);
        throw error;
      }
    }

    if (!this.supportedLaosChains) {
      try {
        const data = await fs.readFile('supported-chains/supported-laos-chains.json', 'utf8');
        this.supportedLaosChains = JSON.parse(data);
      } catch (error) {
        console.error('Error reading supported LAOS chains:', error);
        throw error;
      }
    }
  }

  public getSupportedChains(): any {
    if (!this.supportedChains) {
      throw new Error('Config not initialized. Call loadConfig() first.');
    }
    return this.supportedChains;
  }

  public getSupportedLaosChains(): any {
    if (!this.supportedLaosChains) {
      throw new Error('Config not initialized. Call loadConfig() first.');
    }
    return this.supportedLaosChains;
  }
}

export default Config.getInstance();
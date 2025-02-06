import fs from 'fs/promises';

class Config {
  private static instance: Config;
  private supportedChains: any = null;
  private supportedLaosChains: any = null;
  private defaultOwnershipLaosChain: any = null;

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

    if (!this.defaultOwnershipLaosChain) {
      try {
        const data = await fs.readFile('supported-chains/default-ownership-laos-chain.json', 'utf8');
        this.defaultOwnershipLaosChain = JSON.parse(data);
      } catch (error) {
        console.error('Error reading default ownership LAOS chain JSON:', error);
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

  public getDefaultOwnershipLaosChain(): any {
    if (!this.defaultOwnershipLaosChain) {
      throw new Error('Config not initialized. Call loadConfig() first.');
    }
    return this.defaultOwnershipLaosChain;
  }
}

export default Config.getInstance();
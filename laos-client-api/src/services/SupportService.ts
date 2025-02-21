import { SupportedChainsResponse } from "../types/graphql/outputs/SupportedChanisOutput";
import fs from "fs";

export class SupportService {
  constructor() {}

  public async supportedChains(): Promise<SupportedChainsResponse> {
    try {
      const supportedChainsPath = "./supported-chains/supported-chains-info.json";
      const supportedChains = JSON.parse(fs.readFileSync(supportedChainsPath, "utf-8"));

      return {
        ownershipChains: supportedChains.ownershipChains.map((chain: any) => ({
          name: chain.name,
          chainId: chain.chainId,
        })),
        laosChains: supportedChains.laosChains.map((chain: any) => ({
          name: chain.name,
          laosChainId: chain.laosChainId, 
        })),
      };

    } catch (error) {
      console.error("Supported chains config failed:", error);
      throw error;
    }
  }
}

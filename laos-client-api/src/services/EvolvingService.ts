import { EvolveInput } from "../types/graphql/inputs/EvolveInput";
import { LaosConfig, AssetMetadata, EvolveResult } from "../types";
import { EvolveResponse } from "../types/graphql/outputs/EvolveOutput";
import { ServiceHelper } from "./ServiceHelper";
import ClientService from "./db/ClientService";
import ContractService from "./db/ContractService";

export class EvolvingService {
  private serviceHelper: ServiceHelper;

  constructor() {
    const evolveConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: process.env.RPC_MINTER || '',
    };
    this.serviceHelper = new ServiceHelper(evolveConfig);
  }

  public async evolve(input: EvolveInput, apiKey: string): Promise<EvolveResponse> {
    const { contractAddress, tokenId, name, description, attributes, image, chainId } = input;
    try{
      if (!contractAddress) {
        throw new Error('Contract address is required');
      }
      if(!chainId) {
        throw new Error('Chain id is required');
      }

      const imageUrl = await this.serviceHelper.handleImageUpload(image || '');
      const parsedAttributes = attributes? attributes : [];

      // retrieve contract from db
      const client = await ClientService.getClientByKey(apiKey);
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddress);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const assetMetadata: AssetMetadata = {
        name: name || '',
        description: description || '',
        image: imageUrl,
        attributes: parsedAttributes, 
      };
      try {
        const result: EvolveResult = await this.serviceHelper.laosService.evolve({
          tokenId: tokenId!, 
          assetMetadata, 
          laosContractAddress: contract.batchMinterContract,
        }, apiKey);
        if (result.status === "success") {
          return { 
            tokenId: result.tokenId!, 
            success: true,
            tokenUri: result.tokenUri || '',
            tx: result.tx || ''
          };
        } else {
          throw new Error(result.error ?? "Evolving failed"); // Use nullish coalescing operator
        }
      } catch (error) {
        throw new Error(`Failed to evolve NFT: ${error}`);
      }

    } catch (error) {
      console.error(`Evolving failed for contract: ${contractAddress} on chainId: ${chainId} with tokenId: ${tokenId}`, error);
      throw error;
    }
  }
}
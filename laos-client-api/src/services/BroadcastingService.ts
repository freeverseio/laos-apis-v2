import { BroadcastBatchInput, BroadcastInput } from "../types/graphql/inputs/BroadcastInput";
import { BroadcastBatchParams, BroadcastBatchResult, BroadcastParams, BroadcastResult, OwnershipChainConfig } from "../types";
import { BroadcastBatchResponse, BroadcastResponse } from "../types/graphql/outputs/BroadcastOutput";
import { OwnershipChainService } from "./blockchain/OwnershipChainService";
import ClientService from "./db/ClientService";
import ContractService from "./db/ContractService";


export class BroadcastingService {
  public ownershipChainService: OwnershipChainService;

  constructor() {
    const ownershipChainConfig: OwnershipChainConfig = {
      pvks: process.env.MINTER_KEYS || '',
    };    
    this.ownershipChainService = new OwnershipChainService(ownershipChainConfig);
  }

  public async broadcast(input: BroadcastInput, apiKey: string): Promise<BroadcastResponse> {
    const { tokenId, chainId, ownershipContractAddress, type } = input;
    try {
      // Check the client exists an is active
      const client = await ClientService.getClientByKey(apiKey);
      console.log('Broadcast requested by client:', client.id);
      const contract = await ContractService.getClientContract(client.id, chainId!, ownershipContractAddress!);
      if (!contract) {
        throw new Error('Contract not found');
      }
      const params: BroadcastParams = {
        tokenId: tokenId!,
        chainId: chainId!,
        ownershipContractAddress: ownershipContractAddress!,
      };
    
      const result: BroadcastResult = await this.ownershipChainService.broadcast(params, apiKey, type );

      if (result.status === "success") {
        return { tokenId: result.tokenId!, success: true };
      } else {
        throw new Error(result.error ?? "Broadcasting failed"); // Use nullish coalescing operator
      }
    } catch (error) {
      console.error("Broadcasting failed:", error);
      throw error;
    }
  }

  public async broadcastBatch(input: BroadcastBatchInput, apiKey: string): Promise<BroadcastBatchResponse> {
    const { tokenIds, chainId, ownershipContractAddress, type } = input;
    try {
      // Check the client exists an is active
      const client = await ClientService.getClientByKey(apiKey);
      console.log('Broadcast requested by client:', client.id);
      const contract = await ContractService.getClientContract(client.id, chainId!, ownershipContractAddress!);
      if (!contract) {
        throw new Error('Contract not found');
      }
      const params: BroadcastBatchParams = {
        tokenIds: tokenIds!,
        chainId: chainId!,
        ownershipContractAddress: ownershipContractAddress!,
      };
    
      const result: BroadcastBatchResult = await this.ownershipChainService.broadcastBatch(params, apiKey, type );

      if (result.status === "success") {
        return { tokenIds: result.tokenIds!, success: true };
      } else {
        throw new Error(result.error ?? "Broadcasting failed"); // Use nullish coalescing operator
      }
    } catch (error) {
      console.error("Broadcasting failed:", error);
      throw error;
    }
  }
}

import { EvolveInput } from "../types/graphql/inputs/EvolveInput";
import { LaosConfig, AssetMetadata, EvolveBatchResult, EvolveToken } from "../types";
import { EvolveAsyncStatus, EvolveAsyncResponse, EvolveStatusResponse, EvolveResponse } from "../types/graphql/outputs/EvolveOutput";
import { ServiceHelper } from "./ServiceHelper";
import ClientService from "./db/ClientService";
import ContractService from "./db/ContractService";
import IndexerService from "./indexer/IndexerService";
import fs from "fs";

export class EvolvingService {

  constructor() {}

  public async evolveBatchResponse(trackingId: string): Promise<EvolveStatusResponse> {
    if (!trackingId) {
      throw new Error("Tracking ID is required");
    }
    const elements = trackingId.split(":");
    if (elements.length !== 2) {
      throw new Error("Invalid tracking ID format");
    }
    const laosChainId = elements[0];
    const txHash = elements[1];
    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json";
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    const laosConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: rpcMinterConfig[laosChainId] || '',
    };

    const serviceHelper = new ServiceHelper(laosConfig);
    return serviceHelper.laosService.evolveBatchResponse(txHash);
  }

  public async evolveBatchAsync(input: EvolveInput, apiKey: string): Promise<EvolveAsyncResponse> {
    const { contractAddress, tokens, chainId } = input;
    try{
      if (!contractAddress) {
        throw new Error('Contract address is required');
      }
      if(!chainId) {
        throw new Error('Chain id is required');
      }
      // retrieve contract from db
      const client = await ClientService.getClientByKey(apiKey);
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddress);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const tokensToEvolve: EvolveToken[] = tokens.map(token => {
        if (token.image && token.image.startsWith("data:image/")) {
          throw new Error(`Invalid image format for tokenId ${token.tokenId}: data URIs are not allowed in batch evolve.`);
        }
        return {
          tokenId: token.tokenId,
          assetMetadata: {
            name: token.name,
            description: token.description || '',
            image: token.image || '',
            attributes: token.attributes || [],
          },
        };
      });
     
      try {
        // get from indexer target laosChainId used by this contract
        const indexerService = new IndexerService(process.env.REMOTE_SCHEMA!);
        const laosChainId = await indexerService.getOwnershipContracts(chainId, contractAddress);   
        if (!laosChainId) {
          throw new Error(`Ownership contract not found ${chainId} - ${contractAddress}`);
        }
        const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json";
        const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
        const laosConfig: LaosConfig = {
          minterPvks: process.env.MINTER_KEYS || '',
          rpcMinter: rpcMinterConfig[laosChainId] || '',
        };
        const serviceHelper = new ServiceHelper(laosConfig);
        const result: EvolveBatchResult = await serviceHelper.laosService.evolveBatchAsync({
          laosContractAddress: contract.batchMinterContract,
          tokens: tokensToEvolve,
        }, apiKey); 
        if (result.tx) {
          return { 
            tokenIds: result.tokens.map(token => token.tokenId),
            status: EvolveAsyncStatus.PENDING,
            txHash: result.tx,
            laosChainId: laosChainId,
            trackingId: `${laosChainId}:${result.tx}`,
            message: "Transaction is being submitted to the blockchain"
          };
        } else {
          throw new Error(result.error ?? "Evolving failed");
        }
      } catch (error) {
        throw new Error(`Failed to evolve NFT: ${error}`);
      }

    } catch (error) {
      console.error(`Evolving failed for contract: ${contractAddress} on chainId: ${chainId}`, error);
      throw error;
    }
  }

  public async evolveBatch(input: EvolveInput, apiKey: string): Promise<EvolveResponse> {
    const { contractAddress, tokens, chainId } = input;
    try{
      if (!contractAddress) {
        throw new Error('Contract address is required');
      }
      if(!chainId) {
        throw new Error('Chain id is required');
      }
      // retrieve contract from db
      const client = await ClientService.getClientByKey(apiKey);
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddress);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const tokensToEvolve: EvolveToken[] = tokens.map(token => {
        if (token.image && token.image.startsWith("data:image/")) {
          throw new Error(`Invalid image format for tokenId ${token.tokenId}: data URIs are not allowed in batch evolve.`);
        }
        return {
          tokenId: token.tokenId,
          assetMetadata: {
            name: token.name,
            description: token.description || '',
            image: token.image || '',
            attributes: token.attributes || [],
          },
        };
      });
     
      try {
        // get from indexer target laosChainId used by this contract
        const indexerService = new IndexerService(process.env.REMOTE_SCHEMA!);
        const laosChainId = await indexerService.getOwnershipContracts(chainId, contractAddress);   
        if (!laosChainId) {
          throw new Error(`Ownership contract not found ${chainId} - ${contractAddress}`);
        }
        const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json";
        const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
        const laosConfig: LaosConfig = {
          minterPvks: process.env.MINTER_KEYS || '',
          rpcMinter: rpcMinterConfig[laosChainId] || '',
        };
        const serviceHelper = new ServiceHelper(laosConfig);
        const result: EvolveBatchResult = await serviceHelper.laosService.evolveBatch({
          laosContractAddress: contract.batchMinterContract,
          tokens: tokensToEvolve,
        }, apiKey); 
        if (result.status === "success") {
          return { 
            tokens: result.tokens.map(token => ({
              tokenId: token.tokenId,
              tokenUri: token.tokenUri,
            })),
            success: true,
            tx: result.tx || '',
            laosChainId: laosChainId,
          };
        } else {
          throw new Error(result.error ?? "Evolving failed"); // Use nullish coalescing operator
        }
      } catch (error) {
        throw new Error(`Failed to evolve NFT: ${error}`);
      }

    } catch (error) {
      console.error(`Evolving failed for contract: ${contractAddress} on chainId: ${chainId}`, error);
      throw error;
    }
  }


}
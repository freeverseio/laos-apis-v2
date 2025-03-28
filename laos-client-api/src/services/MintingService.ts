import { AttributeInput, MintInput } from "../types/graphql/inputs/MintInput";
import { LaosConfig, MintSingleNFTParams, MintResult, AssetMetadata, BatchMintNFTParams, BatchMintResult } from "../types";
import { MintAsyncResponse, MintAsyncStatus, MintResponse, MintStatusResponse } from "../types/graphql/outputs/MintOutput";
import { ServiceHelper } from "./ServiceHelper";
import { ethers } from "ethers";
import ContractService from "./db/ContractService";
import ClientService from "./db/ClientService";
import fs from "fs";
import IndexerService from "./indexer/IndexerService";

export class MintingService {

  /**
   * Prepares asset metadata from the given token input.
   * @param token The token input data.
   * @returns {AssetMetadata} The prepared asset metadata.
   */
  private prepareAssetMetadata(token: { name?: string, description?: string, attributes?: AttributeInput[], image?: string }): AssetMetadata {
    const { name, description, attributes, image } = token;
    const parsedAttributes = attributes? attributes : [];
    return {
      name: name || '',
      description: description || '',
      image: image || '',
      attributes: parsedAttributes,
    };
  }

  /**
   * Mints up to multiple NFTs in a batch.
   * @param {MintInput} input - The minting input data.
   * @param {string} apiKey - The API key for authentication.
   * @returns {Promise<MintResponse>} - The result of the minting operation.
   */
  public async mint(input: MintInput, apiKey: string): Promise<MintResponse> {
    const { contractAddress, chainId, tokens } = input;
    const contractAddressLower = contractAddress?.toLowerCase();

    // get from indexer target laosChainId used by this contract
    const indexerService = new IndexerService(process.env.REMOTE_SCHEMA!);
    const laosChainId = await indexerService.getOwnershipContracts(chainId, contractAddressLower);   
    if (!laosChainId) {
      throw new Error(`Ownership contract not found ${chainId} - ${contractAddressLower}`);
    }
    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json";
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    const laosConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: rpcMinterConfig[laosChainId] || '',
    };
    const serviceHelper = new ServiceHelper(laosConfig);       

    try {
      const expandedTokens = await Promise.all(tokens.map(async token => {
        const assetMetadata = this.prepareAssetMetadata(token);
        try {
          
          const cid = await serviceHelper.ipfsService.getCid(assetMetadata);
          const tokenUri = `ipfs://${cid}`;
          serviceHelper.ipfsService.uploadAssetMetadataToIPFS(assetMetadata, token.name, cid);
          return Promise.all(token.mintTo.map(async address => {
            if (!ethers.isAddress(address)) {
              throw new Error("Invalid recipient address");
            }
            const formattedRecipient = ethers.getAddress(address);
            return {
              tokenUri: tokenUri,
              mintTo: formattedRecipient
            };
          }));
        } catch (error) {
          console.error("IPFS upload or address formatting failed:", error);
          throw error;
        }
      }));

      const flatTokens = expandedTokens.flat();

      // retrieve contract from db
      const client = await ClientService.getClientByKey(apiKey);
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddressLower);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const params: BatchMintNFTParams = {
        laosBatchMinterContractAddress: contract.batchMinterContract,
        tokens: flatTokens,
      };

      const result: BatchMintResult = await serviceHelper.laosService.batchMint(params, apiKey);
      if (result.status === "success") {
        return { 
          tokenIds: result.tokenIds!, 
          success: true,
          numberOfTokens: result.numberOfTokens!,
          laosChainId: laosChainId
        };
      } else {
        throw new Error(result.error ?? "Minting failed");
      }
    } catch (error) {
      console.error(`Batch minting failed for contract: ${contractAddressLower} on chainId: ${chainId}`, error);
      throw error;
    }
  }

  public async mintResponse(trackingId: string): Promise<MintStatusResponse> {
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

    return serviceHelper.laosService.mintResponse(txHash);
  }

  public async mintAsync(input: MintInput, apiKey: string): Promise<MintAsyncResponse> {
    const { contractAddress, chainId, tokens } = input;
    const contractAddressLower = contractAddress?.toLowerCase();

    // get from indexer target laosChainId used by this contract
    const indexerService = new IndexerService(process.env.REMOTE_SCHEMA!);
    const laosChainId = await indexerService.getOwnershipContracts(chainId, contractAddressLower);   
    if (!laosChainId) {
      throw new Error(`Ownership contract not found ${chainId} - ${contractAddressLower}`);
    }
    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json";
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    const laosConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: rpcMinterConfig[laosChainId] || '',
    };

    const serviceHelper = new ServiceHelper(laosConfig);

    try {
      const expandedTokens = await Promise.all(tokens.map(async token => {
        const assetMetadata = this.prepareAssetMetadata(token);
        try {
          const cid = await serviceHelper.ipfsService.getCid(assetMetadata);
          const tokenUri = `ipfs://${cid}`;
          serviceHelper.ipfsService.uploadAssetMetadataToIPFS(assetMetadata, token.name, cid);
          return Promise.all(token.mintTo.map(async address => {
            if (!ethers.isAddress(address)) {
              throw new Error("Invalid recipient address");
            }
            const formattedRecipient = ethers.getAddress(address);
            return {
              tokenUri: tokenUri,
              mintTo: formattedRecipient
            };
          }));
        } catch (error) {
          console.error("IPFS upload or address formatting failed:", error);
          throw error;
        }
      }));

      const flatTokens = expandedTokens.flat();

      // retrieve contract from db
      const client = await ClientService.getClientByKey(apiKey);
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddressLower);
      if (!contract) {
        throw new Error('Contract not found');
      }

      const params: BatchMintNFTParams = {
        laosBatchMinterContractAddress: contract.batchMinterContract,
        tokens: flatTokens,
      };

      const result: BatchMintResult = await serviceHelper.laosService.batchMintAsync(params, apiKey);
      if (result.tx ) {
        return { 
          status: MintAsyncStatus.PENDING,
          message: "Transaction is being submitted to the blockchain",
          txHash: result.tx,
          laosChainId: laosChainId,
          trackingId: `${laosChainId}:${result.tx}`,
          tokenIds: result.tokenIds
        };
      } else {
        throw new Error(result.error ?? "Minting failed");
      }
    } catch (error) {
      console.error(`Batch minting failed for contract: ${contractAddressLower} on chainId: ${chainId}`, error);
      throw error;
    }
  } 
}

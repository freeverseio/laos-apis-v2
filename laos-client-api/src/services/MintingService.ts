import { AttributeInput, MintInput } from "../types/graphql/inputs/MintInput";
import { LaosConfig, MintSingleNFTParams, MintResult, AssetMetadata, BatchMintNFTParams, BatchMintResult } from "../types";
import { MintAsyncResponse, MintAsyncStatus, MintResponse, MintStatusResponse } from "../types/graphql/outputs/MintOutput";
import { ServiceHelper } from "./ServiceHelper";
import { ethers } from "ethers";
import ContractService from "./db/ContractService";
import ClientService from "./db/ClientService";
import fs from "fs";

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

    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json"; // 1
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    let laosChainId = "2pi"
    const laosConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: rpcMinterConfig[laosChainId] || '',
    };

    const serviceHelper = new ServiceHelper(laosConfig);

    try {
      const expandedTokens = await Promise.all(tokens.map(async token => {
        // hacer query a indexer api by contract address para saber laos chain id
        // cambiar service helper para que actulice rpc minter

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
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddress);
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
          numberOfTokens: result.numberOfTokens!
        };
      } else {
        throw new Error(result.error ?? "Minting failed");
      }
    } catch (error) {
      console.error(`Batch minting failed for contract: ${contractAddress} on chainId: ${chainId}`, error);
      throw error;
    }
  }

  public async mintResponse(txHash: string): Promise<MintStatusResponse> {
    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json"; // 1
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    let laosChainId = "2pi"
    const laosConfig: LaosConfig = {
      minterPvks: process.env.MINTER_KEYS || '',
      rpcMinter: rpcMinterConfig[laosChainId] || '',
    };

    const serviceHelper = new ServiceHelper(laosConfig);

    return serviceHelper.laosService.mintResponse(txHash);
  }

  public async mintAsync(input: MintInput, apiKey: string): Promise<MintAsyncResponse> {
    const { contractAddress, chainId, tokens } = input;

    const rpcMinterConfigPath = "./supported-chains/laos-chain-rpc.json"; // 1
    const rpcMinterConfig = JSON.parse(fs.readFileSync(rpcMinterConfigPath, "utf-8"));
    let laosChainId = "2pi"
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
      const contract = await ContractService.getClientContract(client.id, chainId, contractAddress);
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
          txHash: result.tx,
          status: MintAsyncStatus.PENDING,
          message: "Transaction is being submitted to the blockchain",
          tokenIds: result.tokenIds,
          contractAddress: result.contractAddress
        };
      } else {
        throw new Error(result.error ?? "Minting failed");
      }
    } catch (error) {
      console.error(`Batch minting failed for contract: ${contractAddress} on chainId: ${chainId}`, error);
      throw error;
    }
  } 
}

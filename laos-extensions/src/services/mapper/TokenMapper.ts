import { GetTokenBalancesInput, TokenIndexer, TokenSupplyInput } from "../../types";
import { AttributeIndexer, TokenBalance, TokenBalancesResponse, TokenResponse, TokenSuppliesResponse, TokenSupply } from "../../types/token";

export class TokenMapper {

  static mapTokenBalances(tokenResponse: TokenResponse, request: GetTokenBalancesInput, chainId: number): TokenBalancesResponse {
    const tokens = tokenResponse.tokens;
    const tokenBalances = tokens.map((token) => this.mapTokenBalance(token, chainId, request.includeMetadata));
    const pageSize = tokenResponse.page?.pageSize !== undefined  ? tokenResponse.page?.pageSize : 100;
    return {
      page: {
        after: tokenResponse.page?.after || "",
        pageSize: pageSize,
        more: tokenResponse.page?.more || false
      },
      balances: tokenBalances
    }
  }

  static mapTokenBalance(token: TokenIndexer, chainId: number, includeMetadata: boolean): TokenBalance {
    return {
        tokenID: token.tokenId,
        balance: "0",
        contractType: "ERC721",
        contractAddress: token.contractAddress,
        accountAddress: token.owner || "",
        blockHash: "",
        blockNumber: token.blockNumber || 0,
        chainId: chainId,
        isSummary: false,
        contractInfo: includeMetadata ? {
          chainId: chainId,
          address: token.contractAddress,
          name: token.contractName || "Universal Contract",
          type: "ERC721",
          symbol: token.contractSymbol || "UC",
          decimals: 0,
          logoURI: "",
          deployed: true,
          bytecodeHash: token.contractBytecodeHash || "",
          extensions: {
            link: "",
            description: "",
            ogImage: "",
            originChainId: chainId,
            originAddress: token.contractAddress,
            verified: true,
          },
          updatedAt: "",
        } : undefined,
        tokenMetadata: includeMetadata ? {
          tokenId: token.tokenId,
          name: token.name || "",
          description: token.description || "",
          image: token.image || "",
          properties: this.mapAttributes(token.attributes || []),
          attributes: token.attributes || [],
          external_url: "",
          decimals: 0,
          updatedAt: token.createdAt || "",
        } : undefined,
    }
  }

  static mapTokenSupplies(tokenResponse: TokenResponse, request: TokenSupplyInput, chainId: number, contractAddress: string): TokenSuppliesResponse {
    const tokens = tokenResponse.tokens;
    const tokenSupplies = tokens.map((token) => this.mapTokenSupply(token, chainId, contractAddress, request.includeMetadata));
    const pageSize = tokenResponse.page?.pageSize !== undefined  ? tokenResponse.page?.pageSize : 100;
    return {
      page: {
        after: tokenResponse.page?.after || "",
        pageSize: pageSize,
        more: tokenResponse.page?.more || false
      },
      contractType: pageSize > 0 ? "ERC721" : "",
      tokenIDs: tokenSupplies
    }
  }
  static mapTokenSupply(token: TokenIndexer, chainId: number, contractAddress: string, includeMetadata: boolean): TokenSupply {
    return {
      tokenID: token.tokenId,
      supply: "1",
      chainId: chainId,
      contractInfo: includeMetadata ? {
        chainId: chainId,
        address: contractAddress,
        name: token.contractName || "Universal Contract",
        type: "ERC721",
        symbol: token.contractSymbol || "UC",
        decimals: 0,
        logoURI: "",
        deployed: true,
        bytecodeHash: token.contractBytecodeHash || "",
        extensions: {
          link: "",
          description: "",
          ogImage: "",
          originChainId: chainId,
          originAddress: contractAddress,
          verified: true,
        },
        updatedAt: ""
      } : undefined,
      tokenMetadata: includeMetadata ? {
        tokenId: token.tokenId,
        name: token.name || "",
        description: token.description || "",
        image: token.image || "",
        properties: this.mapAttributes(token.attributes || []),
        attributes: token.attributes || [],
        external_url: "",
        decimals: 0,
        updatedAt: token.createdAt || "",
      } : undefined,
    };
  }

  static mapAttributes(attributes: AttributeIndexer[]): Record<string, any> {
    return attributes.reduce((result, attribute) => {
      result[attribute.traitType] = attribute.value;
      return result;
    }, {} as Record<string, any>);
  }
}

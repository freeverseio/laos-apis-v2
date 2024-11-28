import { TokenIndexer } from "../../types";
import { AttributeIndexer, TokenBalance, TokenSuppliesResponse, TokenSupply } from "../../types/token";

export class TokenMapper {
  static mapTokenSupplies(tokens: TokenIndexer[], chainId: number, contractAddress: string): TokenSuppliesResponse {
    const tokenSupplies = tokens.map((token) => this.mapTokenSupply(token, chainId, contractAddress));
    return {
      page: {
        after: "sample_cursor",
        pageSize: 50,
        more: true
      },
      contractType: "ERC721",
      tokenIDs: tokenSupplies
    }
  }
  static mapTokenSupply(token: TokenIndexer, chainId: number, contractAddress: string): TokenSupply {
    return {
      tokenID: token.tokenId, // Mapping tokenId from TokenIndexer
      supply: "1", // Assuming supply is not provided, you can adjust accordingly
      chainId: chainId, // Placeholder, update based on your chainId logic
      contractInfo: {
        chainId: chainId, // Placeholder, update based on your logic
        address: contractAddress, // Add logic to extract address
        name: "TODO", // Use name from TokenIndexer, fallback to "Unknown"
        type: "ERC721", // Assuming ERC721, change based on your needs
        symbol: "TODO", // Add logic to populate symbol
        decimals: 0, // Assuming no decimals for ERC721 tokens, change as needed
        logoURI: "?", // Using image as logoURI
        deployed: true, // Assuming deployed, change as needed
        bytecodeHash: "?", // Add logic to populate bytecodeHash
        extensions: {
          link: "?", // Add logic to populate link
          description: "?", // Add logic to populate description
          ogImage: "?", // Use image for OpenGraph image
          originChainId: chainId, // Add logic to populate originChainId
          originAddress: contractAddress, // Add logic to populate originAddress
          verified: true, // Set default as false, update as needed
        },
        updatedAt: "?"
      },
      tokenMetadata: {
        tokenId: token.tokenId,
        name: token.name || "",
        description: token.description || "", // Add logic for description
        image: token.image || "", // Use image from TokenIndexer
        properties: this.mapAttributes(token.attributes), // Add properties mapping logic if applicable
        attributes: token.attributes || [], // Mapping attributes
        external_url: "", // Add logic for external URL
        decimals: 0, // Assuming no decimals for ERC721 tokens
        updatedAt: token.createdAt, 
      },
    };
  }

  static mapAttributes(attributes: AttributeIndexer[]): Record<string, any> {
    return attributes.reduce((result, attribute) => {
      result[attribute.traitType] = attribute.value;
      return result;
    }, {} as Record<string, any>);
  }
}

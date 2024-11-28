interface TokenSupply {
  tokenID: string;
  supply: string;
  chainId: number;
  contractInfo: ContractInfo;
  tokenMetadata?: TokenMetadata;
}

interface TokenBalance {
  contractType: string;
  contractAddress: string;
  accountAddress: string;
  tokenID: string;
  balance: string;
  blockHash: string;
  blockNumber: number;
  chainId: number;
  contractInfo: ContractInfo;
}

interface ContractInfo {
  chainId: number;
  address: string;
  name: string;
  type: string;
  symbol: string;
  decimals?: number;
  logoURI?: string;
  deployed: boolean;
  bytecodeHash: string;
  extensions: {
    link: string;
    description: string;
    ogImage: string;
    originChainId: number;
    originAddress: string;
    verified: boolean;
    verifiedBy?: string;
    featured?: boolean;
  };
  updatedAt: string;
}

interface TokenMetadata {
  tokenId: string;
  name: string;
  description: string;
  image: string;
  properties: Record<string, any>;
  attributes: any;
  external_url: string;
  decimals: number;
  updatedAt: string;
}

interface TokenSuppliesResponse {
  page: {
    after: string;
    pageSize: number;
    more: boolean;
  };
  contractType: string;
  tokenIDs: TokenSupply[];
}

interface TokenBalancesResponse {
  page: {
    pageSize: number;
    more: boolean;
  };
  balances: TokenBalance[];
}

type AttributeIndexer = {
  traitType: string;
  value: string;
}

type TokenIndexer = {
  attributes: AttributeIndexer[];
  tokenId: string;
  image: string;
  name: string;
  owner: string;
  playerId?: string;
  createdAt: string;
}

export {
  TokenSupply,
  TokenBalance,
  ContractInfo,
  TokenMetadata,
  TokenSuppliesResponse,
  TokenBalancesResponse,
  AttributeIndexer,
  TokenIndexer
};
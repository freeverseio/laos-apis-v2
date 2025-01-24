export interface BaseAsset {
  id: string;
  tokenId: bigint;
  owner: string;
  chainId: number;
  transfers: BaseTransfer[];
}

export interface BaseOwnershipContract {
  id: string;
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  bytecodeHash: string;
  assets: BaseAsset[];
}

export interface BaseTransfer {
  id: string;
  asset: BaseAsset;
  from: string;
  to: string;
  timestamp: Date;
}
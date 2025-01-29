export interface BaseAsset {
  id: string;
  tokenId: bigint;
  owner: string;
  transfers: BaseTransfer[];
}

export interface BaseOwnershipContract {
  id: string;
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
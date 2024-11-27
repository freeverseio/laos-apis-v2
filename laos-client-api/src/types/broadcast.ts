export interface BroadcastParams {
  tokenId: string;
  chainId: string;
  ownershipContractAddress: string;
}

export interface BroadcastBatchParams {
  tokenIds: string[];
  chainId: string;
  ownershipContractAddress: string;
}

export interface BroadcastResult {
  status: string;
  tokenId?: string;
  contractAddress?: string;
  tx?: string;
  error?: string;
}

export interface BroadcastBatchResult extends BroadcastResult {
  status: string;
  tokenIds?: string[];
  contractAddress?: string;
  tx?: string;
  error?: string;
}
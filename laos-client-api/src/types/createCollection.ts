export type CreateCollectionRequestBody = {
  name: string;
};

export interface CreateCollectionResult {
  status: string;  
  contractAddress?: string;
  laosAddress?: string;
  batchMinter?: string;
  error?: string;
}
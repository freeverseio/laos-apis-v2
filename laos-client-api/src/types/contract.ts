export interface DbResult {
  batch_minter_contract: string;
  chain_id: string;
  client_id: number;
  contract_address: string;
  id: number;
  laos_contract: string;
}

export interface Contract {
  id: string;
  clientId: string;
  chainId: string;
  contractAddress: string;
  laosContract: string;
  batchMinterContract: string;
}

export interface DeploymentResult {
  contractAddress: string;
  transactionHash: string;
}
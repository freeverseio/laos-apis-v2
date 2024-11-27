

export interface OwnershipContract {
  id: string;
  laosContract: string;
}

export interface OwnershipContractResponse {
  ownershipContracts: OwnershipContract[];
}
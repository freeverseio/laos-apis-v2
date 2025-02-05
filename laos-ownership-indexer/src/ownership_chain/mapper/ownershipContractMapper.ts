import { RawOwnershipContract, BaseOwnershipContract } from '../../model';
import { getGenericOwnershipContractModel } from '../factory';

export function mapToOwnershipContract(raw: RawOwnershipContract): any {

  // Dynamically retrieve the OwnershipContract model
  const OwnershipContract = getGenericOwnershipContractModel<BaseOwnershipContract>(process.env.OWNERSHIP_CONTRACT_MODEL!);

  return new OwnershipContract({
    id: raw.id,
    address: raw.id,
    laosContract: raw.laosContract,
    bytecodeHash: raw.bytecodeHash,
    name: raw.name,
    symbol: raw.symbol,
    assets: [],
  });
}

export function createOwnershipContractsModel(rawOwnershipContracts: RawOwnershipContract[]): any[] {
  return rawOwnershipContracts.map(mapToOwnershipContract);
}

import { RawOwnershipContract, BaseOwnershipContract } from '../../model';
import { generateContractUUID } from '../util';
import { getGenericOwnershipContractModel } from '../factory';

export function mapToOwnershipContract(raw: RawOwnershipContract): any {
  const chainId = Number(process.env.CHAIN_ID!);

  // Dynamically retrieve the OwnershipContract model
  const OwnershipContract = getGenericOwnershipContractModel<BaseOwnershipContract>(process.env.OWNERSHIP_CONTRACT_MODEL!);

  return new OwnershipContract({
    id: generateContractUUID(raw.id, chainId),
    address: raw.id,
    laosContract: raw.laosContract,
    bytecodeHash: raw.bytecodeHash,
    name: raw.name,
    symbol: raw.symbol,
    chainId: chainId,
    assets: [],
  });
}

export function createOwnershipContractsModel(rawOwnershipContracts: RawOwnershipContract[]): any[] {
  return rawOwnershipContracts.map(mapToOwnershipContract);
}

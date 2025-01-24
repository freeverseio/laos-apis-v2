import { RawOwnershipContract, PolygonOwnershipContract as OwnershipContract } from '../../model';
import { generateContractUUID } from '../util';


export function mapToOwnershipContract(raw: RawOwnershipContract): OwnershipContract {
  const chainId = process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 137;
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

export function createOwnershipContractsModel(rawOwnershipContracts: RawOwnershipContract[]): OwnershipContract[] {
  return rawOwnershipContracts.map(mapToOwnershipContract);

}

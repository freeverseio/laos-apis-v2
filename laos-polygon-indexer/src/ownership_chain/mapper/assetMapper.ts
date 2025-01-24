import { RawTransfer } from '../../model';
import { generateAssetUUID } from '../util';
import { getModel } from '../factory';

export function mapToAsset(raw: RawTransfer): any {
  const chainId = Number(process.env.CHAIN_ID!);

  // Retrieve dynamic models
  const Asset = getModel(process.env.ASSET_MODEL!);
  const OwnershipContract = getModel(process.env.OWNERSHIP_CONTRACT_MODEL!);

  const asset = new Asset({
    id: generateAssetUUID(raw.tokenId, raw.ownershipContract, chainId),
    ownershipContract: new OwnershipContract({ id: raw.ownershipContract }),
    tokenId: raw.tokenId,
    owner: raw.to,
    transfers: [],
    chainId: chainId,
  });

  return asset;
}

export function createAssetModels(rawTransfers: RawTransfer[]): any[] {
  return rawTransfers.map(mapToAsset);
}

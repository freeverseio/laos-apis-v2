import { BaseAsset, BaseOwnershipContract, RawTransfer } from '../../model';
import { generateAssetUUID } from '../util';
import { getGenericAssetModel, getGenericOwnershipContractModel } from '../factory';

export function mapToAsset(raw: RawTransfer): any {

  // Retrieve dynamic models
  const Asset = getGenericAssetModel<BaseAsset>(process.env.ASSET_MODEL!);
  const OwnershipContract = getGenericOwnershipContractModel<BaseOwnershipContract>(process.env.OWNERSHIP_CONTRACT_MODEL!);

  const asset = new Asset({
    id: generateAssetUUID(raw.tokenId, raw.ownershipContract),
    ownershipContract: new OwnershipContract({ id: raw.ownershipContract}),
    tokenId: raw.tokenId,
    owner: raw.to,
    transfers: [],
  });

  return asset;
}

export function createAssetModels(rawTransfers: RawTransfer[]): any[] {
  return rawTransfers.map(mapToAsset);
}

import { RawTransfer, PolygonAsset as Asset, PolygonOwnershipContract as OwnershipContract } from '../../model';
import { generateAssetUUID } from '../util';

export function mapToAsset(raw: RawTransfer): Asset {
  const chainId = process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 137;
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

export function createAssetModels(rawTransfers: RawTransfer[]): Asset[] {
  return rawTransfers.map(mapToAsset);
}

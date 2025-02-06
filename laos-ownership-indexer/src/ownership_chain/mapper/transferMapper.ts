import { BaseAsset, BaseTransfer, RawTransfer } from '../../model';
import { getGenericAssetModel, getGenericTransferModel } from '../factory';
import { generateAssetUUID } from '../util';

export function mapToTransfer(raw: RawTransfer): any {
  // Retrieve dynamic models
  const Asset = getGenericAssetModel<BaseAsset>(process.env.ASSET_MODEL!);
  const Transfer = getGenericTransferModel<BaseTransfer>(process.env.TRANSFER_MODEL!);
  return new Transfer({
    id: raw.id,
    asset: new Asset({ id: generateAssetUUID(raw.tokenId, raw.ownershipContract) }),
    from: raw.from,
    to: raw.to,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    txHash: raw.txHash,
  });
}

export function createTransferModels(rawTransfers: RawTransfer[]): any[] {
  return rawTransfers.map(mapToTransfer);
}

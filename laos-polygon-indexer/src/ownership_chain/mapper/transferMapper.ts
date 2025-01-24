import { RawTransfer } from '../../model';
import { getModel } from '../factory';
import { generateAssetUUID } from '../util';

export function mapToTransfer(raw: RawTransfer): any {
  const chainId = Number(process.env.CHAIN_ID!);
  // Retrieve dynamic models
  const Asset = getModel(process.env.ASSET_MODEL!);
  const Transfer = getModel(process.env.TRANSFER_MODEL!);
  return new Transfer({
    id: raw.id,
    asset: new Asset({ id: generateAssetUUID(raw.tokenId, raw.ownershipContract, chainId) }),
    from: raw.from,
    to: raw.to,
    timestamp: raw.timestamp,
    blockNumber: raw.blockNumber,
    txHash: raw.txHash,
    chainId: chainId,
  });
}

export function createTransferModels(rawTransfers: RawTransfer[]): any[] {
  return rawTransfers.map(mapToTransfer);
}

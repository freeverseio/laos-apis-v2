import { RawTransfer, PolygonTransfer as Transfer, PolygonAsset as Asset } from '../../model';
import { generateAssetUUID } from '../util';

export function mapToTransfer(raw: RawTransfer): Transfer {
  const chainId = process.env.CHAIN_ID ? Number(process.env.CHAIN_ID) : 137;
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

export function createTransferModels(rawTransfers: RawTransfer[]): Transfer[] {
  return rawTransfers.map(mapToTransfer);
}

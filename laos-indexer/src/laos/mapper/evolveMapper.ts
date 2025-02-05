import { RawEvolvedWithExternalURI,  MintedModels, BaseLaosAsset } from "../../model";
import { getGenericAssetModel } from "../factory";
import { generateLaosAssetUUID, generateLaosAssetMetadataUUID } from "../util";
import { mapEvolvedWithExternalURItoMetadata } from "./metadataMapper";

export function mapEvolveEvent(raw: RawEvolvedWithExternalURI): MintedModels {
  const metadata = mapEvolvedWithExternalURItoMetadata(raw);
  const LaosAsset = getGenericAssetModel<BaseLaosAsset>(process.env.ASSET_MODEL!);
  const asset = new LaosAsset({
    id: generateLaosAssetUUID(raw._tokenId, raw.contract),
    tokenId: raw._tokenId,
    laosContract: raw.contract,
    metadata: metadata.id,
  });
  console.log('Mapped evolve event:', asset);
  return { metadata, asset };
}

export function createEvolveModels(rawEvolveEvents: RawEvolvedWithExternalURI[]): MintedModels[] {
  return rawEvolveEvents.map((raw) => mapEvolveEvent(raw));
}

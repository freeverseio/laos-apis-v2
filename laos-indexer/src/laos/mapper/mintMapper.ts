import {  MintedModels, RawMintedWithExternalURI } from "../../model";
import { generateLaosAssetUUID } from "../util";
import { mapMintedWithExternalURItoMetadata } from "./metadataMapper";
import { getGenericAssetModel } from "../factory";
import { BaseLaosAsset } from "../../model/abstraction";

export function mapMintedWithExternalURI(raw: RawMintedWithExternalURI): MintedModels {
  const LaosAsset = getGenericAssetModel<BaseLaosAsset>(process.env.ASSET_MODEL!);
  const metadata = mapMintedWithExternalURItoMetadata(raw);
  const asset = new LaosAsset({
    id: generateLaosAssetUUID(raw._tokenId, raw.contract),
    tokenId: raw._tokenId,
    initialOwner: raw._to,
    laosContract: raw.contract,
    createdAt: raw.timestamp,
    logIndex: raw.logIndex,
    metadata: metadata.id,
  });
  console.log('Mapped minted with external URI:', asset);
  return {metadata, asset};
}

export function createMintedWithExternalURIModels(rawMintedWithExternalURI: RawMintedWithExternalURI[]): MintedModels[] {
  return rawMintedWithExternalURI.map((raw) => mapMintedWithExternalURI(raw));
}
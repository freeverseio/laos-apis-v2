import { RawMintedWithExternalURI, RawEvolvedWithExternalURI, TokenUriFetchState, BaseMetadata, BaseLaosAsset, BaseTokenUri} from "../../model";
import { getGenericTokenUriModel } from "../factory";
import { getGenericAssetModel } from "../factory";
import { getGenericMetadataModel } from "../factory";
import { generateLaosAssetUUID, generateLaosAssetMetadataUUID } from "../util";

export function mapMintedWithExternalURItoMetadata(raw: RawMintedWithExternalURI): BaseMetadata {
  const Metadata = getGenericMetadataModel<BaseMetadata>(process.env.METADATA_MODEL!);
  const LaosAsset = getGenericAssetModel<BaseLaosAsset>(process.env.ASSET_MODEL!);
  const TokenUri = getGenericTokenUriModel<BaseTokenUri>(process.env.TOKEN_URI_MODEL!);
  const metadata = new Metadata({
    id: generateLaosAssetMetadataUUID(raw._tokenId, raw.contract),
    tokenUri: new TokenUri({id: raw._tokenURI, state: TokenUriFetchState.Pending}),
    blockNumber: raw.blockNumber,
    timestamp: raw.timestamp,
    txHash: raw.txHash,
    laosAsset: new LaosAsset({
      id: generateLaosAssetUUID(raw._tokenId, raw.contract),
      tokenId: raw._tokenId,
      initialOwner: raw._to,
      logIndex: raw.logIndex,
      laosContract: raw.contract,
    }),

  });
  return metadata;
}

export function mapEvolvedWithExternalURItoMetadata(raw: RawEvolvedWithExternalURI): BaseMetadata {
  const Metadata = getGenericMetadataModel<BaseMetadata>(process.env.METADATA_MODEL!);
  const LaosAsset = getGenericAssetModel<BaseLaosAsset>(process.env.ASSET_MODEL!);
  const TokenUri = getGenericTokenUriModel<BaseTokenUri>(process.env.TOKEN_URI_MODEL!);
  const metadata = new Metadata({
    id: generateLaosAssetMetadataUUID(raw._tokenId, raw.contract),
    tokenUri: new TokenUri({id: raw._tokenURI, state: TokenUriFetchState.Pending}),
    blockNumber: raw.blockNumber,
    timestamp: raw.timestamp,
    txHash: raw.txHash,
    laosAsset: new LaosAsset({
      id: generateLaosAssetUUID(raw._tokenId, raw.contract),
      tokenId: raw._tokenId,
      laosContract: raw.contract,
    }),
  });
  return metadata;
}



export function createMetadataModels(rawMintedWithExternalURI: RawMintedWithExternalURI[]):BaseMetadata[] {
  return rawMintedWithExternalURI.map((raw) => mapMintedWithExternalURItoMetadata(raw));
}
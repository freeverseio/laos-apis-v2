export interface AssetMetadata {
  name: string;
  description: string;
  image: string;
  attributes: AssetAttributes[];
}

export interface AssetAttributes {
  trait_type: string;
  value: string;
}

export const getAssetAttributesJson = (assetMetadata: AssetMetadata): string => {
  return JSON.stringify(assetMetadata.attributes, null, 2);
}


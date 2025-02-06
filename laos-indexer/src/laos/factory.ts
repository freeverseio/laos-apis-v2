import * as Model from '../model';
import { BaseLaosAsset, BaseMetadata, BaseTokenUri } from '../model/';


export function getGenericAssetModel<T extends BaseLaosAsset>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}

export function getGenericMetadataModel<T extends BaseMetadata>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}

export function getGenericTokenUriModel<T extends BaseTokenUri>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}
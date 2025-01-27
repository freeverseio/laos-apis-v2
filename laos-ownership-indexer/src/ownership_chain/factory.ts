import * as Model from '../model';
import { BaseAsset, BaseOwnershipContract, BaseTransfer } from '../model/abstraction';


export function getGenericOwnershipContractModel<T extends BaseOwnershipContract>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}

export function getGenericAssetModel<T extends BaseAsset>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}

export function getGenericTransferModel<T extends BaseTransfer>(modelType: string): new (...args: any[]) => T {
  const model = (Model as Record<string, any>)[modelType];
  if (!model) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return model as new (...args: any[]) => T;
}
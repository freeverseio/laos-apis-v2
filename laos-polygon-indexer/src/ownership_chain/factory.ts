import * as Model from '../model';
import { BaseAsset, BaseOwnershipContract, BaseTransfer } from '../model/abstraction';

export function getOwnershipContract(contractType: string) {
  const OwnershipContract = (Model as any)[contractType]; // Cast Model to 'any'
  if (!OwnershipContract) {
    throw new Error(`Contract type ${contractType} not found`);
  }
  return OwnershipContract;
}

export function getModel(modelType: string): any {
  if (!(modelType in Model)) {
    throw new Error(`Model type ${modelType} not found`);
  }
  return (Model as Record<string, any>)[modelType];
}

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
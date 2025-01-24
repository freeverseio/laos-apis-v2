import * as Model from '../model';

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
  return (Model as Record<string, any>)[modelType]; // Safely access the model dynamically
}
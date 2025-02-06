import { TypeormDatabase, TypeormDatabaseOptions, Store } from '@subsquid/typeorm-store';
import { processor } from './processor';
import { getGenericOwnershipContractModel } from './factory'; 
import { EventDetectionService } from './service/EventDetectionService';
import { createOwnershipContractsModel } from './mapper/ownershipContractMapper';
import { createTransferModels } from './mapper/transferMapper';
import { createAssetModels } from './mapper/assetMapper';
import { BaseOwnershipContract } from '../model/abstraction';
import Config from '../config/config';
const options: TypeormDatabaseOptions = {
  supportHotBlocks: true,
  stateSchema: process.env.SCHEMA_NAME!,
};

const OwnershipContract = getGenericOwnershipContractModel<BaseOwnershipContract>(process.env.OWNERSHIP_CONTRACT_MODEL!); // Use the factory to get the correct contract

processor.run<Store>(new TypeormDatabase(options), async (ctx) => {
  const supportedLaosChains = await Config.getSupportedLaosChains();
  console.log('Supported Laos Chains:', supportedLaosChains);
  const ownerShipContracts = await ctx.store.find(OwnershipContract);
  const ownershipContractIds = new Set(ownerShipContracts.map(contract => contract.id));

  const service = new EventDetectionService(ctx, ownershipContractIds, supportedLaosChains);
  const detectedEvents = service.detectEvents();

  const rawOwnershipContracts = detectedEvents.ownershipContracts;
  const rawTransfers = detectedEvents.transfers;

  if (rawOwnershipContracts.length > 0) {
    const ownershipContractsModelArray = createOwnershipContractsModel(rawOwnershipContracts);
    await ctx.store.insert(ownershipContractsModelArray);
  }

  if (rawTransfers.length > 0) {
    const assetsModels = createAssetModels(rawTransfers);
    for (const assetModel of assetsModels) {
      await ctx.store.upsert(assetModel);
    }
    const transfersModelArray = createTransferModels(rawTransfers);
    await ctx.store.insert(transfersModelArray);
  }
});

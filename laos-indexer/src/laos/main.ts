import { Store, TypeormDatabase, TypeormDatabaseOptions } from '@subsquid/typeorm-store';
import { createEvolveModels } from './mapper/evolveMapper';
import { createMintedWithExternalURIModels } from './mapper/mintMapper';
import { createTokenUriModels } from './mapper/tokenUriMapper';
import { processor } from './processor';
import { CustomStore } from './service/CustomStore';
import { EventDetectionService } from './service/EventDetectionService';
import { processTokenURIs } from './tokenUriProcessor';

const options: TypeormDatabaseOptions = {
  supportHotBlocks: true,
  stateSchema: 'laos_processor',
};

processor.run<Store>(new TypeormDatabase(options) as any, async (ctx) => {
  const service = new EventDetectionService(ctx);
  const detectedEvents = service.detectEvents();
  const mintEvents = detectedEvents.mintEvents;
  const evolveEvents = detectedEvents.evolveEvents;
  let processTokenUris = false;

  if (mintEvents.length > 0) {
    processTokenUris = true;
    const mints = createMintedWithExternalURIModels(mintEvents);
    const tokenUris = createTokenUriModels(mintEvents);
    await ctx.store.upsert(tokenUris);
    await ctx.store.upsert(mints.map(mint => mint.asset));
    await ctx.store.insert(mints.map(mint => mint.metadata));
  }

  if (evolveEvents.length > 0) {
    processTokenUris = true;
  
    const evolves = createEvolveModels(evolveEvents);
    const customStore = new CustomStore(ctx.store['em']());
  
    try {
      const { updatedIds: existingIds , updatedTokenIds: existingTokenIds } = await customStore.evolve(evolves.map(evolve => evolve.asset));
      const validEvolves = evolves.filter(evolve => existingIds.includes(evolve.asset.id));
      await ctx.store.insert(validEvolves.map(evolve => evolve.metadata));
      const tokenUris = createTokenUriModels(evolveEvents.filter(evolveEvent => existingTokenIds.includes(evolveEvent._tokenId)));
      await ctx.store.upsert(tokenUris);
  
    } catch (error) {
      console.error('Error processing evolves:', error);
    }
  }
  if (processTokenUris) {
    processTokenURIs();
  }

});
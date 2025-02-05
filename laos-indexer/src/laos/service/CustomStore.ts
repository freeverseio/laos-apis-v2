import { EntityManager, UpdateResult } from 'typeorm';
import { BaseLaosAsset } from '../../model';
import { getGenericAssetModel } from '../factory';

export class CustomStore {
  private entityManager: EntityManager;

  constructor(em: EntityManager) {
    this.entityManager = em;
  }

  async evolve(entities: BaseLaosAsset[]): Promise<{ updatedIds: string[]; updatedTokenIds: bigint[] }> {
    const updatedIds: string[] = [];
    const updatedTokenIds: bigint[] = [];
    const LaosAsset = getGenericAssetModel<BaseLaosAsset>(process.env.ASSET_MODEL!);
  
    for (const entity of entities) {
      const { id, ...attributes } = entity;
  
      try {
        const result: UpdateResult = await this.entityManager.update(LaosAsset, id, attributes);
  
        if (result.affected && result.affected > 0) {
          updatedIds.push(id);
          updatedTokenIds.push(entity.tokenId);
        }
      } catch (error) {
        throw new Error(`Failed to update LaosAsset with ID ${id}: ${error}`);
      }
    }
  
    return { updatedIds, updatedTokenIds };
  }
}

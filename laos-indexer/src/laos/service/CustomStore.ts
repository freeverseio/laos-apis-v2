import { EntityManager, UpdateResult } from 'typeorm';
import { LaosAsset } from '../../model';

export class CustomStore {
  private entityManager: EntityManager;

  constructor(em: EntityManager) {
    this.entityManager = em;
  }

  async evolve(entities: LaosAsset[]): Promise<string[]> {
    const updatedIds: string[] = []; 

    for (const entity of entities) {
      const { id, ...attributes } = entity;

      try {
        const result: UpdateResult = await this.entityManager.update(LaosAsset, id, attributes);

        // Check if rows were affected
        if (result.affected && result.affected > 0) {
          updatedIds.push(id);
        }
      } catch (error) {
        throw new Error(`Failed to update LaosAsset with ID ${id}: ${error}`);
      }
    }

    return updatedIds; 
  }
}

import { TokenOrderByOptions, TokenOwnersWhereInput, TokenPaginationInput, TokenWhereInput } from '../model';
import { buildTokenQueryBase, buildTokenByIdQuery, buildTokenCountQueryBase, buildTokenOwnerQuery } from './queries';

interface WhereConditionsResult {
  conditions: string[];
  parameters: any[];
  paramIndex: number;
}

interface CursorConditionResult {
  condition: string;
  parameters: any[];
  paramIndex: number;
}

export class QueryBuilderService {
  
  private buildWhereConditions(where: TokenWhereInput | TokenOwnersWhereInput): WhereConditionsResult {
    let conditions = [];
    let parameters = [];
    let paramIndex = 1;

    if (where?.owner) {
      conditions.push(`LOWER(COALESCE(a.owner, la.initial_owner)) = LOWER($${paramIndex++})`);
      parameters.push(where.owner.toLowerCase());
    }
    if (where?.contractAddress) {
      conditions.push(`LOWER(oc.id) = LOWER($${paramIndex++})`);
      parameters.push(where.contractAddress.toLowerCase());
    }
    if (where?.laosContract) {
      conditions.push(`LOWER(la.laos_contract) = LOWER($${paramIndex++})`);
      parameters.push(where.laosContract.toLowerCase());
    }
    if (where?.tokenId) {
      conditions.push(`la.token_id = $${paramIndex++}`);
      parameters.push(where.tokenId);
    }

    return { conditions, parameters, paramIndex };
  }

  private buildCursorCondition(afterCursor: string, effectiveOrderBy: string, paramIndex: number): CursorConditionResult {
    const decodedCursor = Buffer.from(afterCursor, 'base64').toString('ascii');
    const [afterCreatedAt, afterLogIndex, afterContractId] = decodedCursor.split(':').map(part => part.trim());
    let condition = '';
    let parameters = [];

    if (effectiveOrderBy === TokenOrderByOptions.CREATED_AT_ASC) {
      condition = `("la"."created_at" > to_timestamp($${paramIndex++} / 1000.0) 
        OR ("la"."created_at" = to_timestamp($${paramIndex - 1} / 1000.0) 
        AND (la.log_index > $${paramIndex++} 
        OR (la.log_index = $${paramIndex - 1} AND LOWER(oc.id) > LOWER($${paramIndex++})))))`;
    } else {
      condition = `("la"."created_at" < to_timestamp($${paramIndex++} / 1000.0) 
        OR ("la"."created_at" = to_timestamp($${paramIndex - 1} / 1000.0) 
        AND (la.log_index < $${paramIndex++} 
        OR (la.log_index = $${paramIndex - 1} AND LOWER(oc.id) > LOWER($${paramIndex++})))))`;
    }

    parameters.push(afterCreatedAt);
    parameters.push(afterLogIndex);
    parameters.push(afterContractId.toLowerCase());

    return { condition, parameters, paramIndex };
  }

  private getOrderDetails(orderBy: TokenOrderByOptions = TokenOrderByOptions.CREATED_AT_ASC): { effectiveOrderBy: string; orderDirection: string } {
    const effectiveOrderBy = orderBy || TokenOrderByOptions.CREATED_AT_ASC;
    const orderDirection = effectiveOrderBy.split(' ')[1];
    return { effectiveOrderBy, orderDirection };
  }

  private getPrefix(chainId: any) {
    let prefix = '';
    if (chainId === '137') {
      prefix = 'polygon';
  
    } else if (chainId === '1') {
      prefix = 'ethereum';
  
    } else {
      throw new Error('Unsupported chain ID: ' + chainId);
    }
    return prefix;
  }

  private buildTokenQueryBaseByChainId(chainId: string) {
    let prefix = this.getPrefix(chainId);
    const mainQuery = buildTokenQueryBase(prefix);
    return mainQuery;
  }

  private buildTokenByIdQueryByChainId(chainId: string) {
    let prefix = this.getPrefix(chainId);
    const mainQuery = buildTokenByIdQuery(prefix);
    return mainQuery;
  }

  private buildTokenCountQueryBaseByChainId(chainId: string) {
    let prefix = this.getPrefix(chainId);
    const mainQuery = buildTokenCountQueryBase(prefix);
    return mainQuery;
  }

  private buildTokenOwnerQueryByChainId(chainId: string) {
    let prefix = this.getPrefix(chainId);
    const mainQuery = buildTokenOwnerQuery(prefix);
    return mainQuery;
  }

  async buildTokenQuery(
    where: TokenWhereInput,
    pagination: TokenPaginationInput,
    orderBy?: TokenOrderByOptions
  ): Promise<{ query: string; parameters: any[] }> {
    const effectiveFirst = pagination.first;
    const afterCursor = pagination.after;
    const { effectiveOrderBy, orderDirection } = this.getOrderDetails(orderBy);
    const { conditions, parameters, paramIndex: initialParamIndex } = this.buildWhereConditions(where);
    let paramIndex = initialParamIndex;

    if (afterCursor) {
      const { condition, parameters: cursorParameters, paramIndex: newParamIndex } = this.buildCursorCondition(afterCursor, effectiveOrderBy, paramIndex);
      conditions.push(condition);
      parameters.push(...cursorParameters);
      paramIndex = newParamIndex;
    }

    const mainQuery = this.buildTokenQueryBaseByChainId(where?.chainId); 
    const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
      ORDER BY ${effectiveOrderBy}, la.log_index ${orderDirection}, oc.id ASC
      LIMIT $${paramIndex}
    `;
console.log('Query:', query); // Log the query
    parameters.push(effectiveFirst + 1);
    return { query, parameters };    
  }

  async buildTokenQueryCount(where: TokenWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildWhereConditions(where);

    const mainQuery = this.buildTokenCountQueryBaseByChainId(where?.chainId);
     const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;

    return { query, parameters };
  }

  async buildTokenByIdQuery(ownershipContractId: string, tokenId: string, chainId): Promise<{ query: string; parameters: any[] }> {
    const normalizedOwnershipContractId = ownershipContractId.toLowerCase(); // Convert to lowercase
    const parameters = [normalizedOwnershipContractId, tokenId];
    const mainQuery = this.buildTokenByIdQueryByChainId(chainId);
    return { query: mainQuery, parameters };
  }

  async buildTokenOwnerQuery(where: TokenOwnersWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildWhereConditions(where);

    const mainQuery = this.buildTokenOwnerQueryByChainId(where?.chainId);
    const query = `
      ${buildTokenOwnerQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    return { query, parameters };
  }
}

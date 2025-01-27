import { TokenOrderByOptions, TokenOwnersWhereInput, TokenPaginationInput, TokenWhereInput, TransferOrderByOptions, TransferPaginationInput, TransferWhereInput } from '../model';
import { buildTokenQueryBase, buildTokenByIdQuery, buildTokenCountQueryBase, buildTokenOwnerQuery } from './queries';

// Supported chain IDs
enum ChainIds {
  POLYGON = '137',
  ETHEREUM = '1'
}

// Supported chain prefix names
const ChainNames: Record<ChainIds, string> = {
  [ChainIds.POLYGON]: 'polygon',
  [ChainIds.ETHEREUM]: 'ethereum',
};

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
  
  private buildTokenWhereConditions(where: TokenWhereInput | TokenOwnersWhereInput): WhereConditionsResult {
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
 
  private getChainPrefix(chainId: string): string {
    const chainName = ChainNames[chainId as ChainIds];
    if (!chainName) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return chainName;
  }  

  private buildTokenQueryBaseByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const mainQuery = buildTokenQueryBase(prefix);
    return mainQuery;
  }

  private buildTokenByIdQueryByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const mainQuery = buildTokenByIdQuery(prefix);
    return mainQuery;
  }

  private buildTokenCountQueryBaseByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const mainQuery = buildTokenCountQueryBase(prefix);
    return mainQuery;
  }

  private buildTokenOwnerQueryByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
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
    const { conditions, parameters, paramIndex: initialParamIndex } = this.buildTokenWhereConditions(where);
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

    parameters.push(effectiveFirst + 1);
    return { query, parameters };    
  }

  async buildTokenQueryCount(where: TokenWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildTokenWhereConditions(where);
    const mainQuery = this.buildTokenCountQueryBaseByChainId(where?.chainId);
    const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;

    return { query, parameters };
  }

  async buildTokenByIdQuery(ownershipContractId: string, tokenId: string, chainId: string): Promise<{ query: string; parameters: any[] }> {
    const normalizedOwnershipContractId = ownershipContractId.toLowerCase();
    const parameters = [normalizedOwnershipContractId, tokenId];
    const mainQuery = this.buildTokenByIdQueryByChainId(chainId);
    return { query: mainQuery, parameters };
  }

  async buildTokenOwnerQuery(where: TokenOwnersWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildTokenWhereConditions(where);
    const mainQuery = this.buildTokenOwnerQueryByChainId(where?.chainId);
    const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    return { query, parameters };
  }

async buildTransferQuery(
  where?: TransferWhereInput,
  pagination?: TransferPaginationInput,
  orderBy?: TransferOrderByOptions
): Promise<{ query: string; parameters: any[] }> {
  const conditions: string[] = [];
  const parameters: any[] = [];
  let paramIndex = 1;

  const prefix = this.getChainPrefix(where?.chainId);
  const baseQuery = `
    SELECT 
      t.from,
      t.to,
      t.timestamp,
      t.block_number as "blockNumber",
      t.tx_hash as "txHash",
      la.token_id,
      oc.id as contract_address
    FROM ${prefix}_transfer t
    INNER JOIN ${prefix}_asset a ON t.asset_id = a.id
    INNER JOIN laos_asset la ON la.token_id = a.token_id
    INNER JOIN ${prefix}_ownership_contract oc ON oc.laos_contract = la.laos_contract
  `;

  if (where) {
    if (where.tokenId) {
      conditions.push(`la.token_id = $${paramIndex}`);
      parameters.push(where.tokenId);
      paramIndex++;
    }
    if (where.contractAddress) {
      conditions.push(`LOWER(oc.id) = LOWER($${paramIndex})`);
      parameters.push(where.contractAddress);
      paramIndex++;
    }
    if (where.to) {
      conditions.push(`LOWER(t.to) = LOWER($${paramIndex})`);
      parameters.push(where.to);
      paramIndex++;
    }
    if (where.from) {
      conditions.push(`LOWER(t.from) = LOWER($${paramIndex})`);
      parameters.push(where.from);
      paramIndex++;
    }
    if (where.to_startsWith) {
      conditions.push(`t.to ILIKE $${paramIndex}`);
      parameters.push(`${where.to_startsWith}%`);
      paramIndex++;
    }
  }

  let query = baseQuery;
  
  if (conditions.length > 0) {
    query += ` WHERE ${conditions.join(' AND ')}`;
  }

  if (orderBy) {
    const [field, direction] = orderBy.split(' ');
    query += ` ORDER BY t.${field} ${direction}`;
  } else {
    query += ` ORDER BY t.timestamp DESC`;
  }

  if (pagination) {
    if (pagination.limit) {
      query += ` LIMIT $${paramIndex}`;
      parameters.push(pagination.limit);
      paramIndex++;
    }
    if (pagination.offset) {
      query += ` OFFSET $${paramIndex}`;
      parameters.push(pagination.offset);
      paramIndex++;
    }
  }

  return { query, parameters };
}
}
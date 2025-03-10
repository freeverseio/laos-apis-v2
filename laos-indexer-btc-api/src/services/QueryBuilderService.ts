import { OwnershipContractsPaginationInput, OwnershipContractsWhereInput, TokenHistoryPaginationInput, TokenOrderByOptions, TokenOwnersWhereInput, TokenPaginationInput, TokensByCollectionWhereInput, TokenWhereInput, TransferOrderByOptions, TransferPaginationInput, TransferWhereInput } from '../model';
import { buildTokenQueryBase, buildTokenByIdQuery, buildTokenCountQueryBase, buildTokenOwnerQuery, buildOwnershipContractsQueryByPrefix } from './queries';
import { LaosChain } from '../model/laosChain.model';

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
  private supportedChains: Record<string, string>;
  private supportedLaosChains: Record<string, string>;
  private defaultOwnershipLaosChain: Record<string, string>;

  constructor() { }

  private getChainPrefix(chainId: string): string {
    const chainPrefix = this.supportedChains[chainId];
    if (!chainPrefix) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return chainPrefix;
  }

  private getLaosChain(chainId: string, laosChainId: string): LaosChain {
    let useLaosChainId = laosChainId;
    if (!useLaosChainId) {
      useLaosChainId = this.defaultOwnershipLaosChain[chainId];
    }
    const laosChainPrefix = this.supportedLaosChains[useLaosChainId];
    if (!laosChainPrefix) {
      throw new Error(`Unsupported LAOS chain ID: ${useLaosChainId}`);
    }
    return { 
      id: useLaosChainId, 
      prefix: laosChainPrefix 
    };
  }

  private buildTokenWhereConditions(where: TokensByCollectionWhereInput | TokenOwnersWhereInput, laosConractAddress: String): WhereConditionsResult {
    let conditions = [];
    let parameters = [];
    let paramIndex = 1;

    if (where?.owner) {
      conditions.push(`LOWER(COALESCE(a.owner, la.initial_owner)) = LOWER($${paramIndex++})`);
      parameters.push(where.owner.toLowerCase());
    }    
    if (where?.laosContract) {
      conditions.push(`LOWER(la.laos_contract) = LOWER($${paramIndex++})`);
      parameters.push(where.laosContract.toLowerCase());
    }
    if (where?.tokenId) {
      conditions.push(`la.token_id = $${paramIndex++}`);
      parameters.push(where.tokenId);
    }

    conditions.push(`la.laos_contract = $${paramIndex++}`);
    parameters.push(laosConractAddress); // LAOS mainnet chain id

    return { conditions, parameters, paramIndex };
  }

  private buildOwnershipContractsWhereConditions(where: OwnershipContractsWhereInput): WhereConditionsResult {
    let conditions = [];
    let parameters = [];
    let paramIndex = 1;

    if (where?.contractAddress) {
      conditions.push(`id = $${paramIndex++}`); // same as address but with index
      parameters.push(where.contractAddress.toLowerCase());
    }
    if (where?.laosContract) {
      conditions.push(`laos_contract = $${paramIndex++}`);
      parameters.push(where.laosContract.toLowerCase());
    }
    if (where?.name) {
      conditions.push(`LOWER(name) = LOWER($${paramIndex++})`);
      parameters.push(where.name.toLowerCase());
    }
    if (where?.symbol) {
      conditions.push(`LOWER(symbol) = LOWER($${paramIndex++})`);
      parameters.push(where.symbol.toLowerCase());
    }
    if (where?.laosChainId) {
      conditions.push(`laos_chain_id = $${paramIndex++}`);
      parameters.push(where.laosChainId);
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

  private buildTokenQueryBase(orderByClause: string) {
    const mainQuery = buildTokenQueryBase(orderByClause);
    return mainQuery;
  }

  private buildTokenByIdQueryByChainId(chainId: string, laosChainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const laosChain = this.getLaosChain(chainId, laosChainId);
    return buildTokenByIdQuery(prefix, laosChain.prefix, laosChain.id);
  }

  private buildTokenCountQueryBaseByChainId() {
    return buildTokenCountQueryBase();
  }

  private buildTokenOwnerQueryByChainId(chainId: string, laosChain: LaosChain) {
    const prefix = this.getChainPrefix(chainId);    
    return buildTokenOwnerQuery(prefix, laosChain.prefix);
  }

  private buildOwnershipContractsQueryByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
    return buildOwnershipContractsQueryByPrefix(prefix);
  }

  async buildTokenQuery(
    where: TokensByCollectionWhereInput,
    pagination: TokenPaginationInput,
    orderBy?: TokenOrderByOptions,
    laosContractAddress?: string
  ): Promise<{ query: string; parameters: any[] }> {
    const effectiveFirst = pagination.first;
    const afterCursor = pagination.after;
    const { effectiveOrderBy, orderDirection } = this.getOrderDetails(orderBy);
    const { conditions, parameters, paramIndex: initialParamIndex } = this.buildTokenWhereConditions(where, laosContractAddress);
    let paramIndex = initialParamIndex;

    if (afterCursor) {
      const { condition, parameters: cursorParameters, paramIndex: newParamIndex } = this.buildCursorCondition(afterCursor, effectiveOrderBy, paramIndex);
      conditions.push(condition);
      parameters.push(...cursorParameters);
      paramIndex = newParamIndex;
    }

    // build query with subquery to prevent ordering all the set and then appply limit. Around 90% more efficient
    const orderByClause = `ORDER BY ${effectiveOrderBy}, la.log_index ${orderDirection}`;
    const mainQuery = this.buildTokenQueryBase(orderByClause); 
    const query = `
      WITH ranked AS (
        ${mainQuery}
        ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
      )
      SELECT *
      FROM ranked
      WHERE row_num <= $${paramIndex};     
    `;

    parameters.push(effectiveFirst + 1);
    return { query, parameters };    
  }

  async buildTokenQueryCount(where: TokensByCollectionWhereInput, laosConractAddress?: string): Promise<{ query: string; parameters: any[] }> {    
    const { conditions, parameters } = this.buildTokenWhereConditions(where, laosConractAddress);
    const mainQuery = this.buildTokenCountQueryBaseByChainId();
    const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;

    return { query, parameters };
  }

  async buildTokenByIdQuery(ownershipContractId: string, tokenId: string, chainId: string, laosChainId?: string): Promise<{ query: string; parameters: any[] }> {
    const normalizedOwnershipContractId = ownershipContractId.toLowerCase();
    const parameters = [normalizedOwnershipContractId, tokenId];
    const mainQuery = this.buildTokenByIdQueryByChainId(chainId, laosChainId);
    return { query: mainQuery, parameters };
  }

  // async buildTokenOwnerQuery(where: TokenOwnersWhereInput): Promise<{ query: string; parameters: any[] }> {
  //   const laosChain = this.getLaosChain(where?.chainId, where?.laosChainId);
  //   const { conditions, parameters } = this.buildTokenWhereConditions(where, laosChain);
  //   const mainQuery = this.buildTokenOwnerQueryByChainId(where?.chainId, laosChain);
  //   const query = `
  //     ${mainQuery}
  //     ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
  //   `;
  //   return { query, parameters };
  // }

  async buildOwnershipContractsQuery(where: OwnershipContractsWhereInput, pagination: OwnershipContractsPaginationInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildOwnershipContractsWhereConditions(where);
    const mainQuery = this.buildOwnershipContractsQueryByChainId(where!.chainId);

    let query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;

    if (pagination) {
      if (pagination.limit && (typeof pagination.limit === 'number' && pagination.limit >= 0)) {
        query += ` LIMIT ${pagination.limit}`;
      }
      if (pagination.offset && typeof pagination.offset === 'number' && pagination.offset >= 0) {
        query += ` OFFSET ${pagination.offset}`;
      }
    }

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

    const ownershipPrefix = this.getChainPrefix(where?.chainId);
    // TODO get default laosChainId depending on chainId if not provied
    const laosChain = this.getLaosChain(where?.chainId, where?.laosChainId);
    const baseQuery = `
      SELECT 
        t.from,
        t.to,
        t.timestamp,
        t.block_number as "blockNumber",
        t.tx_hash as "txHash",
        la.token_id,
        oc.id as contract_address
      FROM ${ownershipPrefix}_transfer t
      INNER JOIN ${ownershipPrefix}_asset a ON t.asset_id = a.id
      INNER JOIN ${laosChain.prefix}_laos_asset la ON la.token_id = a.token_id
      INNER JOIN ${ownershipPrefix}_ownership_contract oc ON oc.laos_contract = la.laos_contract
    `;

    if (where) {
      conditions.push(`oc.laos_chain_id = $${paramIndex}`);
      parameters.push(laosChain.id); // always informed (default value)
      paramIndex++;

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


  async buildTokenHistoryQuery(
    contractAddress: string,
    tokenId: string,
    chainId: string,
    laosChainId?: string,
    pagination?: TokenHistoryPaginationInput
  ): Promise<{ query: string; parameters: any[] }> {
    const parameters: any[] = [tokenId, contractAddress];
    let paramIndex = 3;
    const ownershipPrefix = this.getChainPrefix(chainId);
    const laosChain = this.getLaosChain(chainId, laosChainId);
  
    let query = `
      SELECT 
        tu.id AS "tokenUri",
        tu.name AS name,
        tu.description AS description,
        tu.image AS image,
        tu.attributes AS attributes,
        tu.state AS "tokenUriFetchState",
        m.block_number,
        m.tx_hash,
        m."timestamp" as "updatedAt",
        oc.id AS "contractAddress"
      FROM 
        ${laosChain.prefix}_metadata m
      INNER JOIN 
        ${laosChain.prefix}_laos_asset la ON m.laos_asset_id = la.id
      INNER JOIN 
        ${ownershipPrefix}_ownership_contract oc ON LOWER(la.laos_contract) = LOWER(oc.laos_contract)
      INNER JOIN 
        ${laosChain.prefix}_token_uri tu ON m.token_uri_id = tu.id
      WHERE 
        oc.laos_chain_id = ${laosChain.id}
        AND la.token_id = $1
        AND LOWER(oc.id) = $2        
    `;
  
    if (pagination?.orderBy) {
      query += ` ORDER BY ${pagination.orderBy}`;
    } else {
      query += ` ORDER BY m."timestamp" DESC`;
    }
  
    if (pagination?.limit) {
      query += ` LIMIT $${paramIndex}`;
      parameters.push(pagination.limit);
      paramIndex++;
    }
  
    if (pagination?.offset) {
      query += ` OFFSET $${paramIndex}`;
      parameters.push(pagination.offset);
    }
  
    return { query, parameters };
  }  

}
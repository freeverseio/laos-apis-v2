import { OwnershipContractsWhereInput, TokenHistoryPaginationInput, TokenOrderByOptions, TokenOwnersWhereInput, TokenPaginationInput, TokenWhereInput, TransferOrderByOptions, TransferPaginationInput, TransferWhereInput } from '../model';
import { buildTokenQueryBase, buildTokenByIdQuery, buildTokenCountQueryBase, buildTokenOwnerQuery, buildOwnershipContractsQueryByPrefix } from './queries';
import Config from '../config/config';

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

  constructor() {
    this.supportedChains = Config.getSupportedChains();
    this.supportedLaosChains = Config.getSupportedLaosChains();
    this.defaultOwnershipLaosChain = Config.getDefaultOwnershipLaosChain();
  }

  private getChainPrefix(chainId: string): string {
    const chainPrefix = this.supportedChains[chainId];
    if (!chainPrefix) {
      throw new Error(`Unsupported chain ID: ${chainId}`);
    }
    return chainPrefix;
  }

  private getLaosChainPrefix(chainId: string, laosChainId: string): string {
    let useLaosChainId = laosChainId;
    if (!useLaosChainId) {
      useLaosChainId = this.defaultOwnershipLaosChain[chainId];
    }
    const laosChainPrefix = this.supportedLaosChains[useLaosChainId];
    if (!laosChainPrefix) {
      throw new Error(`Unsupported LAOS chain ID: ${useLaosChainId}`);
    }
    return laosChainPrefix;
  }

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

  private buildOwnershipContractsWhereConditions(where: OwnershipContractsWhereInput ): WhereConditionsResult {
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

  private buildTokenQueryBaseByChainId(chainId: string, laosChainId: string, orderByClause: string) {
    const prefix = this.getChainPrefix(chainId);
    const laosPrefix = this.getLaosChainPrefix(chainId, laosChainId);
    const mainQuery = buildTokenQueryBase(prefix, laosPrefix, orderByClause);
    return mainQuery;
  }

  private buildTokenByIdQueryByChainId(chainId: string, laosChainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const laosPrefix = this.getLaosChainPrefix(chainId, laosChainId);
    return buildTokenByIdQuery(prefix, laosPrefix);
  }

  private buildTokenCountQueryBaseByChainId(chainId: string, laosChainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const laosPrefix = this.getLaosChainPrefix(chainId, laosChainId);
    return buildTokenCountQueryBase(prefix, laosPrefix);
  }

  private buildTokenOwnerQueryByChainId(chainId: string, laosChainId: string) {
    const prefix = this.getChainPrefix(chainId);
    const laosPrefix = this.getLaosChainPrefix(chainId, laosChainId);
    return buildTokenOwnerQuery(prefix, laosPrefix);
  }

  private buildOwnershipContractsQueryByChainId(chainId: string) {
    const prefix = this.getChainPrefix(chainId);
    return buildOwnershipContractsQueryByPrefix(prefix);
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

    // build query with subquery to prevent ordering all the set and then appply limit. Around 90% more efficient
    const orderByClause = `ORDER BY ${effectiveOrderBy}, la.log_index ${orderDirection}, oc.id ASC`;
    const mainQuery = this.buildTokenQueryBaseByChainId(where!.chainId, where!.laosChainId, orderByClause); 
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

  async buildTokenQueryCount(where: TokenWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildTokenWhereConditions(where);
    const mainQuery = this.buildTokenCountQueryBaseByChainId(where!.chainId, where!.laosChainId);
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

  async buildTokenOwnerQuery(where: TokenOwnersWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildTokenWhereConditions(where);
    const mainQuery = this.buildTokenOwnerQueryByChainId(where?.chainId, where?.laosChainId);
    const query = `
      ${mainQuery}
      ${conditions.length ? 'WHERE ' + conditions.join(' AND ') : ''}
    `;
    return { query, parameters };
  }

  async buildOwnershipContractsQuery(where: OwnershipContractsWhereInput): Promise<{ query: string; parameters: any[] }> {
    const { conditions, parameters } = this.buildOwnershipContractsWhereConditions(where);
    const mainQuery = this.buildOwnershipContractsQueryByChainId(where?.chainId);
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

    const ownershipPrefix = this.getChainPrefix(where?.chainId);
    // TODO get default laosChainId depending on chainId if not provied
    const laosPrefix = this.getLaosChainPrefix(where?.chainId, where?.laosChainId);
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
      INNER JOIN ${laosPrefix}_laos_asset la ON la.token_id = a.token_id
      INNER JOIN ${ownershipPrefix}_ownership_contract oc ON oc.laos_contract = la.laos_contract
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
    // TODO get default laosChainId depending on chainId if not provied
    const laosPrefix = this.getLaosChainPrefix(chainId, laosChainId);
  
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
        ${laosPrefix}_metadata m
      INNER JOIN 
        ${laosPrefix}_laos_asset la ON m.laos_asset_id = la.id
      INNER JOIN 
        ${ownershipPrefix}_ownership_contract oc ON LOWER(la.laos_contract) = LOWER(oc.laos_contract)
      INNER JOIN 
        ${laosPrefix}_token_uri tu ON m.token_uri_id = tu.id
      WHERE 
        la.token_id = $1
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
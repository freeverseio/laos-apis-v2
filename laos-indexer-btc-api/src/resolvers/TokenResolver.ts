import { Arg, Query, Resolver } from 'type-graphql';
import { TokenOrderByOptions, TokenPaginationInput, TokenConnection, TokenQueryResult, TokenQueryResultSelect, TokenWhereInput, PageInfo, TokenOwnersQueryResult, TokenOwnersWhereInput, OwnershipContractsWhereInput, OwnershipContractsQueryResult, OwnershipContractsPaginationInput, TokensByCollectionWhereInput } from '../model';
import { QueryBuilderService } from '../services/QueryBuilderService';
import { BtcService } from '../services/btc/BtcService';

@Resolver()
export class TokenResolver {
  private queryBuilderService: QueryBuilderService;

  constructor(private tx: (query: string, params?: any[]) => Promise<any[]>) {
    this.queryBuilderService = new QueryBuilderService();
  }

  @Query(() => TokenConnection, { nullable: true })
  async tokensByCollection(
    @Arg('where', () => TokensByCollectionWhereInput, { nullable: false }) where: TokensByCollectionWhereInput,
    @Arg('pagination', () => TokenPaginationInput, { nullable: false, defaultValue: { first: 10 } }) pagination: TokenPaginationInput,
    @Arg('orderBy', () => TokenOrderByOptions, { nullable: true }) orderBy?: TokenOrderByOptions
  ): Promise<TokenConnection> {
    // Call BTC indexer    
    const baseUrl = process.env.INDEXER_BTC_RPC || 'INDEXER_BTC_RPC_not_provided!';
    const btcService = new BtcService(baseUrl);
    const collection = await btcService.getCollectionById(where.collectionId);
    if (!collection || !collection.laosContractAddress) {
      return new TokenConnection([], null, 0);
    }
    const laosContractAddress = collection.laosContractAddress;
    //const laosContractAddress = "0xfffffffffffffffffffffffe0000000000000006";
    
    const { query, parameters } = await this.queryBuilderService.buildTokenQuery(where, pagination, orderBy, laosContractAddress);
    const { query: countQuery, parameters: countParameters } = await this.queryBuilderService.buildTokenQueryCount(where, laosContractAddress);
    const tokens = await this.fetchTokens(query, parameters);
    const count = await this.tx(countQuery, countParameters);
    const totalCount = count && count.length > 0 ? parseInt(count[0].count, 10) : 0;
    const hasNextPage = tokens.length > pagination.first;

    if (hasNextPage) {
      tokens.pop();
    }

    const edges = tokens.map(token => ({
      cursor: Buffer.from(`${new Date(token.createdAt).getTime()}:${token.logIndex}:${token.contractAddress}`).toString('base64'),
      node: {
        ...token,
        createdAt: new Date(token.createdAt),
      },
    }));

    const pageInfo = new PageInfo({
      endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : "",
      hasNextPage: hasNextPage,
      hasPreviousPage: Boolean(pagination.after),
      startCursor: edges.length > 0 ? edges[0].cursor : "",
    });

    return new TokenConnection(edges, pageInfo, totalCount);
  }

  private async fetchTokens(query: string, parameters: any[]): Promise<TokenQueryResultSelect[]> {
    const results = await this.tx(query, parameters);

    return results.map((result: any) => {
      return new TokenQueryResultSelect({
        ...result,
        createdAt: new Date(result.createdAt),
      });
    });
  }

  // @Query(() => TokenQueryResult, { nullable: true })
  // async token(
  //   @Arg('chainId', () => String) chainId: string,
  //   @Arg('contractAddress', () => String) contractAddress: string,
  //   @Arg('tokenId', () => String) tokenId: string,
  //   @Arg('laosChainId', () => String, { nullable: true }) laosChainId: string
  // ): Promise<TokenQueryResult | null> {
  //   const { query, parameters } = await this.queryBuilderService.buildTokenByIdQuery(contractAddress, tokenId, chainId, laosChainId);
  //   const result = await this.tx(query, parameters);

  //   if (result.length === 0) {
  //     return null;
  //   }

  //   const transformedResult = {
  //     ...result[0],
  //     createdAt: new Date(result[0].createdAt),
  //   };

  //   return new TokenQueryResult(transformedResult);
  // }

  // @Query(() => TokenConnection, { nullable: true })
  // async tokens(
  //   @Arg('where', () => TokensByCollectionWhereInput, { nullable: false }) where: TokensByCollectionWhereInput,
  //   @Arg('pagination', () => TokenPaginationInput, { nullable: false, defaultValue: { first: 10 } }) pagination: TokenPaginationInput,
  //   @Arg('orderBy', () => TokenOrderByOptions, { nullable: true }) orderBy?: TokenOrderByOptions
  // ): Promise<TokenConnection> {
  //   const { query, parameters } = await this.queryBuilderService.buildTokenQuery(where, pagination, orderBy);
  //   const { query: countQuery, parameters: countParameters } = await this.queryBuilderService.buildTokenQueryCount(where);

  //   const tokens = await this.fetchTokens(query, parameters);
  //   const count = await this.tx(countQuery, countParameters);
  //   const totalCount = count && count.length > 0 ? parseInt(count[0].count, 10) : 0;
  //   const hasNextPage = tokens.length > pagination.first;

  //   if (hasNextPage) {
  //     tokens.pop();
  //   }

  //   const edges = tokens.map(token => ({
  //     cursor: Buffer.from(`${new Date(token.createdAt).getTime()}:${token.logIndex}:${token.contractAddress}`).toString('base64'),
  //     node: {
  //       ...token,
  //       createdAt: new Date(token.createdAt),
  //     },
  //   }));

  //   const pageInfo = new PageInfo({
  //     endCursor: edges.length > 0 ? edges[edges.length - 1].cursor : "",
  //     hasNextPage: hasNextPage,
  //     hasPreviousPage: Boolean(pagination.after),
  //     startCursor: edges.length > 0 ? edges[0].cursor : "",
  //   });

  //   return new TokenConnection(edges, pageInfo, totalCount);
  // }

  // @Query(() => [TokenOwnersQueryResult], { nullable: true })
  // async tokenOwners(
  //   @Arg('where', () => TokenOwnersWhereInput, { nullable: false }) where: TokenOwnersWhereInput
  // ): Promise<TokenOwnersQueryResult[] | null> { // Return an array or null
  //   const { query, parameters } = await this.queryBuilderService.buildTokenOwnerQuery(where);
  //   const result = await this.tx(query, parameters);
  //   return result.map((item: any) => new TokenOwnersQueryResult(item));
  // }

  // @Query(() => [OwnershipContractsQueryResult], { nullable: true })
  // async ownershipContracts(
  //   @Arg('where', () => OwnershipContractsWhereInput, { nullable: false }) where: OwnershipContractsWhereInput,
  //   @Arg('pagination', () => OwnershipContractsPaginationInput, { nullable: true, defaultValue: { limit: 10, offset: 0 } }) pagination: OwnershipContractsPaginationInput
  // ): Promise<OwnershipContractsQueryResult[] | null> { // Return an array or null
  //   const { query, parameters } = await this.queryBuilderService.buildOwnershipContractsQuery(where, pagination);
  //   const result = await this.tx(query, parameters);
  //   return result.map((item: any) => new OwnershipContractsQueryResult({
  //     chainId: where.chainId,
  //     contractAddress: item.id,
  //     laosChainId: item.laos_chain_id,
  //     laosContract: item.laos_contract,
  //     name: item.name,
  //     symbol: item.symbol,
  //     bytecodeHash: item.bytecode_hash
  //   }));    
  // }

}

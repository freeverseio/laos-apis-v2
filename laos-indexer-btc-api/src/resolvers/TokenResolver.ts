import { Arg, Query, Resolver } from 'type-graphql';
import { TokenOrderByOptions, TokenPaginationInput, TokenConnection, TokenQueryResult, TokenQueryResultSelect, TokenWhereInput, PageInfo, TokenOwnersQueryResult, TokenOwnersWhereInput, OwnershipContractsWhereInput, CollectionsQueryResult, OwnershipContractsPaginationInput, TokensByCollectionWhereInput } from '../model';
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
    console.log(`Retrieving tokens for laosContractAddress: ${laosContractAddress}`);
    
    const { query, parameters } = await this.queryBuilderService.buildTokenQuery(where, pagination, orderBy, laosContractAddress);
    const { query: countQuery, parameters: countParameters } = await this.queryBuilderService.buildTokenQueryCount(where, laosContractAddress);
    const tokens = await this.fetchTokens(query, parameters);

    // update the tokens current owner    
    const ownerPromises = tokens.map(async (token) => {
      const owner = await btcService.getTokenCurrenOwner(where.collectionId, token.tokenId);
      if (owner?.owner) {
        token.owner = owner.owner;
      }
    });    
    await Promise.all(ownerPromises);    

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


  @Query(() => [CollectionsQueryResult], { nullable: true })
  async collections(): Promise<CollectionsQueryResult[] | null> { // Return an array or null
    const baseUrl = process.env.INDEXER_BTC_RPC || 'INDEXER_BTC_RPC_not_provided!';
    const btcService = new BtcService(baseUrl);
    const collections = await btcService.getAllCollections();
    if (!collections || !collections.entries) {
      return null;
    }

     return collections.entries.map((item: any) => new CollectionsQueryResult({
        id: item.id,
        laosContractAddress: item.LAOS_address,
        rebaseable: item.rebaseable
     })); 
  }


}

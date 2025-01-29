import { Arg, Query, Resolver } from 'type-graphql';
import { TokenHistoryQueryResult, TokenHistoryPaginationInput, TokenHistoryOrderByOptions } from '../model';
import { QueryBuilderService } from '../services/QueryBuilderService';

@Resolver()
export class TokenHistoryResolver {
  private queryBuilderService: QueryBuilderService;

  constructor(private tx: (query: string, params?: any[]) => Promise<any[]>) {
    this.queryBuilderService = new QueryBuilderService();
  }

  @Query(() => [TokenHistoryQueryResult], { nullable: true })
  async tokenHistory(
    @Arg('chainId', () => String) chianId: string,
    @Arg('contractAddress', () => String) contractAddress: string,
    @Arg('tokenId', () => String) tokenId: string,
    @Arg('pagination', () => TokenHistoryPaginationInput, { nullable: true }) pagination?: TokenHistoryPaginationInput
  ): Promise<TokenHistoryQueryResult[] | null> {
    const normalizedContractAddress = contractAddress.toLowerCase();

    // Build the query using QueryBuilderService
    const { query, parameters } = await this.queryBuilderService.buildTokenHistoryQuery(
      normalizedContractAddress,
      tokenId,
      chianId,
      pagination
    );

    // Execute the query
    const results = await this.tx(query, parameters);

    return results.map(result => {
      if (typeof result.attributes === 'string') {
        result.attributes = JSON.parse(result.attributes);
      }
      return new TokenHistoryQueryResult({
        ...result,
        updatedAt: new Date(result.updatedAt),
      });
    });
  }
}

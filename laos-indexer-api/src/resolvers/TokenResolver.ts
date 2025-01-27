import { Arg, Query, Resolver } from 'type-graphql';
import { TokenOrderByOptions, TokenPaginationInput, TokenConnection, TokenQueryResult, TokenQueryResultSelect, TokenWhereInput, PageInfo, TokenOwnersQueryResult, TokenOwnersWhereInput } from '../model';
import { QueryBuilderService } from '../services/QueryBuilderService';
import Database from '../services/db/Database';

@Resolver()
export class TokenResolver {
  private queryBuilderService: QueryBuilderService;

  constructor(private tx: (query: string, params?: any[]) => Promise<any[]>) {
    this.queryBuilderService = new QueryBuilderService();
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

  @Query(() => TokenQueryResult, { nullable: true })
  async token(
    @Arg('chainId', () => String) chianId: string,
    @Arg('contractAddress', () => String) contractAddress: string,
    @Arg('tokenId', () => String) tokenId: string
  ): Promise<TokenQueryResult | null> {
    const { query, parameters } = await this.queryBuilderService.buildTokenByIdQuery(contractAddress, tokenId, chianId);
    const result = await this.tx(query, parameters);

    if (result.length === 0) {
      return null;
    }

    const transformedResult = {
      ...result[0],
      createdAt: new Date(result[0].createdAt),
    };

    return new TokenQueryResult(transformedResult);
  }

  @Query(() => TokenConnection, { nullable: true })
  async tokens(
    @Arg('where', () => TokenWhereInput, { nullable: true }) where: TokenWhereInput,
    @Arg('pagination', () => TokenPaginationInput, { nullable: false, defaultValue: { first: 10 } }) pagination: TokenPaginationInput,
    @Arg('orderBy', () => TokenOrderByOptions, { nullable: true }) orderBy?: TokenOrderByOptions
  ): Promise<TokenConnection> {
    const { query, parameters } = await this.queryBuilderService.buildTokenQuery(where, pagination, orderBy);
    const { query: countQuery, parameters: countParameters } = await this.queryBuilderService.buildTokenQueryCount(where);

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

  @Query(() => [TokenOwnersQueryResult], { nullable: true })
  async tokenOwners(
    @Arg('where', () => TokenOwnersWhereInput, { nullable: true }) where: TokenOwnersWhereInput
  ): Promise<TokenOwnersQueryResult[] | null> { // Return an array or null
    const { query, parameters } = await this.queryBuilderService.buildTokenOwnerQuery(where);
    const result = await this.tx(query, parameters);

    console.log(result);

    return result.map((item: any) => new TokenOwnersQueryResult(item));
  }

}

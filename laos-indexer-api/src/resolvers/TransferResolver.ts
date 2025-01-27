import { Arg, Query, Resolver } from 'type-graphql';
import { TransferQueryResult, TransferWhereInput, TransferPaginationInput, TransferOrderByOptions } from '../model';
import { QueryBuilderService } from '../services/QueryBuilderService';

@Resolver()
export class TransferResolver {
  private queryBuilderService: QueryBuilderService;

  constructor(private tx: (query: string, params?: any[]) => Promise<any[]>) {
    this.queryBuilderService = new QueryBuilderService();
  }

  @Query(() => [TransferQueryResult], { nullable: true })
  async transfers(
    @Arg('where', () => TransferWhereInput, { nullable: true }) where?: TransferWhereInput,
    @Arg('pagination', () => TransferPaginationInput, { nullable: true }) pagination?: TransferPaginationInput,
    @Arg('orderBy', () => TransferOrderByOptions, { nullable: true }) orderBy?: TransferOrderByOptions
  ): Promise<TransferQueryResult[]> {
    const { query, parameters } = await this.queryBuilderService.buildTransferQuery(where, pagination, orderBy);
    const results = await this.tx(query, parameters);

    return results.map(transfer => new TransferQueryResult({
      from: transfer.from,
      to: transfer.to,
      timestamp: transfer.timestamp,
      blockNumber: transfer.blockNumber,
      txHash: transfer.txHash,
      tokenId: transfer.token_id.toString(),
      contractAddress: transfer.contract_address
    }));
  }
}
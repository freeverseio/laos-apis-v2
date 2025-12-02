import { TokenResolver } from '../../src/resolvers/TokenResolver';
import { BtcService } from '../../src/services/btc/BtcService';

jest.mock('../../src/services/btc/BtcService');

const MockedBtc = BtcService as jest.MockedClass<typeof BtcService>;

describe('TokenResolver.tokensByCollection', () => {
  const tx = jest.fn();
  let resolver: TokenResolver;

  beforeEach(() => {
    jest.resetAllMocks();
    resolver = new TokenResolver(tx);
  });

  test('returns empty connection when no collection found', async () => {
    MockedBtc.prototype.getCollectionById.mockResolvedValue(null as any);
    const where: any = { collectionId: 'c1' };
    const pagination: any = { first: 1 };
    const res = await resolver.tokensByCollection(where, pagination);
    expect(res.totalCount).toBe(0);
    expect(res.edges).toEqual([]);
  });

  test('queries DB and returns edges', async () => {
    MockedBtc.prototype.getCollectionById.mockResolvedValue({ id: 'c1', evmCollectionAddress: '0xCOL', rebaseable: false } as any);

    const sample = [{
      tokenId: '1',
      owner: '0x1',
      initialOwner: '0x1',
      createdAt: new Date().toISOString(),
      logIndex: 1,
      laosContract: '0xLAOS',
      tokenUri: 'uri',
      block_number: 1,
    }];
    tx.mockResolvedValueOnce(sample) // fetchTokens
      .mockResolvedValueOnce([{ count: '1' }]);

    const where: any = { collectionId: 'c1' };
    const pagination: any = { first: 1 };
    const result = await resolver.tokensByCollection(where, pagination);
    expect(tx).toHaveBeenCalledTimes(2);
    expect(result.totalCount).toBe(1);
    expect(result.edges.length).toBe(1);
    expect(result.pageInfo).toBeTruthy();
  });
});

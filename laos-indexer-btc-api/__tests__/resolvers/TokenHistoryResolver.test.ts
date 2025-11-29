import { TokenHistoryResolver } from '../../src/resolvers/TokenHistoryResolver';

describe('TokenHistoryResolver.tokenHistory', () => {
  const tx = jest.fn();
  let resolver: TokenHistoryResolver;

  beforeEach(() => {
    resolver = new TokenHistoryResolver(tx);
    const svc: any = (resolver as any).queryBuilderService;
    svc.supportedChains = { mainnet: 'mainnet' };
    svc.supportedLaosChains = { '100': 'mainnet' };
    svc.defaultOwnershipLaosChain = { mainnet: '100' };
    jest.resetAllMocks();
  });

  test('parses JSON attributes and maps dates', async () => {
    const now = new Date().toISOString();
    tx.mockResolvedValueOnce([
      { attributes: '{"k":1}', updatedAt: now, tokenUri: 'u', name: 'n', description: 'd', image: 'i', block_number: 1, tx_hash: '0x' }
    ]);
    const res = await resolver.tokenHistory('mainnet', '0xC', '1', '100', { limit: 1 } as any);
    expect(res[0].attributes).toEqual({ k: 1 });
    expect(res[0].updatedAt).toBeInstanceOf(Date);
  });
});
